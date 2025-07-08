export const getCustomers = async (req, res, next) => {
  try {
    const { rows } = await req.db.query(
      "SELECT customerID, firstName, lastName, email, phone FROM Customers ORDER BY lastName, firstName"
    );
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    next(err);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await req.db.query(
      `SELECT c.*, co.countryName 
       FROM Customers c
       JOIN Countries co ON c.countryCode = co.countryCode
       WHERE c.customerID = $1`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
};

export const searchCustomers = async (req, res, next) => {
  try {
    const { lastName, email } = req.query;
    
    if (!lastName && !email) {
      return res.status(400).json({
        success: false,
        message: "Must provide either lastName or email for search"
      });
    }

    let query = "SELECT customerID, firstName, lastName, email, phone FROM Customers";
    const params = [];
    
    if (lastName && email) {
      query += " WHERE lastName ILIKE $1 AND email ILIKE $2";
      params.push(`%${lastName}%`, `%${email}%`);
    } else if (lastName) {
      query += " WHERE lastName ILIKE $1";
      params.push(`%${lastName}%`);
    } else {
      query += " WHERE email ILIKE $1";
      params.push(`%${email}%`);
    }
    
    query += " ORDER BY lastName, firstName";
    
    const { rows } = await req.db.query(query, params);
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      address,
      city,
      state,
      postalCode,
      countryCode,
      phone,
      email,
      password
    } = req.body;

    // Check if customer exists
    const checkResult = await req.db.query(
      "SELECT 1 FROM Customers WHERE customerID = $1",
      [id]
    );
    
    if (checkResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    const { rows } = await req.db.query(
      `UPDATE Customers SET
        firstName = COALESCE($1, firstName),
        lastName = COALESCE($2, lastName),
        address = COALESCE($3, address),
        city = COALESCE($4, city),
        state = COALESCE($5, state),
        postalCode = COALESCE($6, postalCode),
        countryCode = COALESCE($7, countryCode),
        phone = COALESCE($8, phone),
        email = COALESCE($9, email),
        password = COALESCE($10, password)
      WHERE customerID = $11
      RETURNING customerID, firstName, lastName, email, phone`,
      [
        firstName, lastName, address, city, state,
        postalCode, countryCode, phone, email, password,
        id
      ]
    );

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        message: "Email already in use by another customer"
      });
    }
    if (err.code === '23503') {
      return res.status(400).json({
        success: false,
        message: "Invalid country code"
      });
    }
    next(err);
  }
};

export const customerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const { rows } = await req.db.query(
      `SELECT customerID, firstName, lastName, email, phone 
       FROM Customers 
       WHERE email = $1 AND password = $2`,
      [email, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
};
