import bcrypt from "bcrypt";
import pool from "./dbconfig.js";

async function createAdmin() {
  const username = "admin2";
  const plainPassword = "Admin1234";
  const role = "admin";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await pool.query(
    `INSERT INTO administrators (username, password, role)
     VALUES ($1, $2, $3)`,
    [username, hashedPassword, role]
  );

  console.log("Admin created successfully");
}

createAdmin().catch(console.error);
