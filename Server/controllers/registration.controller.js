export const getRegistrationsByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { rows } = await req.db.query(
      `SELECT r.*, p.name as productName 
       FROM Registrations r
       JOIN Products p ON r.productCode = p.productCode
       WHERE r.customerId = $1`,
      [customerId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const registerProduct = async (req, res, next) => {
  try {
    const { customerId, productCode } = req.body;
    const { rows } = await req.db.query(
      `INSERT INTO Registrations (customerId, productCode)
       VALUES ($1, $2) RETURNING *`,
      [customerId, productCode]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ message: "Invalid customer or product" });
    }
    if (err.code === '23505') { 
      return res.status(409).json({ message: "Product already registered" });
    }
    next(err);
  }
};