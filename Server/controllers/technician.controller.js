export const getTechnicians = async (req, res, next) => {
  try {
    const { rows } = await req.db.query("SELECT * FROM Technicians ORDER BY lastName, firstName");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const getTechnicianById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await req.db.query(
      "SELECT * FROM Technicians WHERE techID = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Technician not found" 
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

import bcrypt from 'bcrypt';

export const createTechnician = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    
  
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { rows } = await req.db.query(
      `INSERT INTO Technicians (firstName, lastName, email, phone, password)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [firstName, lastName, email, phone, hashedPassword] 
    );
    

    const technicianData = rows[0];
    delete technicianData.password;

    res.status(201).json({
      success: true,
      data: technicianData
    });
  } catch (err) {
    if (err.code === '23505') { 
      return res.status(409).json({ 
        success: false,
        message: "Email already exists" 
      });
    }
    next(err);
  }
};
export const updateTechnician = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, password } = req.body;

    
    const checkResult = await req.db.query(
      "SELECT 1 FROM Technicians WHERE techID = $1",
      [id]
    );
    
    if (checkResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Technician not found"
      });
    }

    const { rows } = await req.db.query(
      `UPDATE Technicians 
       SET firstName = $1, 
           lastName = $2, 
           email = $3, 
           phone = $4, 
           password = COALESCE($5, password)
       WHERE techID = $6
       RETURNING *`,
      [firstName, lastName, email, phone, password, id]
    );

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        message: "Email already in use by another technician"
      });
    }
    next(err);
  }
};

export const deleteTechnician = async (req, res, next) => {
  try {
    const { id } = req.params;

    
    const checkResult = await req.db.query(
      "SELECT 1 FROM Technicians WHERE techID = $1",
      [id]
    );
    
    if (checkResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Technician not found"
      });
    }


    const incidentsResult = await req.db.query(
      "SELECT 1 FROM Incidents WHERE techID = $1 LIMIT 1",
      [id]
    );
    
    if (incidentsResult.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete technician assigned to incidents"
      });
    }

    await req.db.query(
      "DELETE FROM Technicians WHERE techID = $1",
      [id]
    );

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const searchTechnicians = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters"
      });
    }

    const searchTerm = `%${query}%`;
    const { rows } = await req.db.query(
      `SELECT * FROM Technicians 
       WHERE firstName ILIKE $1 OR lastName ILIKE $1 OR email ILIKE $1
       ORDER BY lastName, firstName`,
      [searchTerm]
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    next(err);
  }
};