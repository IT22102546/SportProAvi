import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../utils/dbconfig.js";
import dotenv from "dotenv";
dotenv.config();

//regex expressions
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^(?:\+?61|0)4\d{8}$/.test(phone);
const validatePassword = (password) => password.length >= 5;

export const signUp = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      address,
      city,
      state,
      postalcode,
      countrycode,
      phone,
      email,
      password,
    } = req.body;

    if (!firstname || !lastname || !email || !password || !phone) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePhone(phone)) {
      return res
        .status(400)
        .json({ message: "Invalid Australian phone number" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters" });
    }

    const emailCheck = await pool.query(
      "SELECT email FROM customers WHERE email = $1",
      [email]
    );
    if (emailCheck.rowCount > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO customers 
      (firstname, lastname, address, city, state, postalcode, countrycode, phone, email, password, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'customer')`,
      [
        firstname,
        lastname,
        address,
        city,
        state,
        postalcode,
        countrycode,
        phone,
        email,
        hashedPassword,
      ]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const { rows } = await pool.query(
      `SELECT * FROM customers WHERE email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.customerid,
        email: user.email,
        role: user.role || "customer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = user;

    res.status(200).json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Customer signin error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const signOut = (req, res) => {
  res.clearCookie("token");
  return res.json({ success: true, message: "Logged out successfully" });
};

export const adminSignIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const { rows } = await pool.query(
      `SELECT * FROM administrators WHERE username = $1`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin.username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...adminData } = admin;

    res.status(200).json({
      success: true,
      token,
      user: adminData,
    });
  } catch (error) {
    console.error("Admin signin error:", error);
    res.status(500).json({ message: "Admin login failed" });
  }
};
