export const createIncident = async (req, res, next) => {
  try {
    const { customerID, productCode, title, description } = req.body;

    if (!customerID || !productCode || !title || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields (customerID, productCode, title, description)",
      });
    }

    const { rows } = await req.db.query(
      `INSERT INTO Incidents 
       (customerID, productCode, title, description)
       VALUES ($1, $2, $3, $4)
       RETURNING incidentID, dateOpened`,
      [customerID, productCode, title, description]
    );

    res.status(201).json({
      success: true,
      incidentID: rows[0].incidentid,
      dateOpened: rows[0].dateopened,
    });
  } catch (err) {
    if (err.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Invalid customerID or productCode",
      });
    }
    next(err);
  }
};
export const assignTechnician = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { techID } = req.body;

    if (!techID) {
      return res.status(400).json({
        success: false,
        message: "Technician ID is required",
      });
    }

    const incidentExists = await req.db.query(
      "SELECT 1 FROM Incidents WHERE incidentID = $1",
      [id]
    );

    if (incidentExists.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    const technicianExists = await req.db.query(
      "SELECT 1 FROM Technicians WHERE techID = $1",
      [techID]
    );

    if (technicianExists.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Technician not found",
      });
    }

    const { rows } = await req.db.query(
      `UPDATE Incidents 
       SET techID = $1
       WHERE incidentID = $2
       RETURNING *`,
      [techID, id]
    );

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const getIncidents = async (req, res, next) => {
  try {
    const { rows } = await req.db.query(
      `SELECT i.incidentID, i.title, i.dateOpened, i.dateClosed,
              c.firstName || ' ' || c.lastName AS customerName,
              p.name AS productName,
              t.firstName || ' ' || t.lastName AS technicianName
       FROM Incidents i
       JOIN Customers c ON i.customerID = c.customerID
       JOIN Products p ON i.productCode = p.productCode
       LEFT JOIN Technicians t ON i.techID = t.techID
       ORDER BY i.dateOpened DESC`
    );
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    next(err);
  }
};

export const getIncidentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await req.db.query(
      `SELECT i.*, 
              c.firstName || ' ' || c.lastName AS customerName,
              p.name AS productName,
              t.firstName || ' ' || t.lastName AS technicianName
       FROM Incidents i
       JOIN Customers c ON i.customerID = c.customerID
       JOIN Products p ON i.productCode = p.productCode
       LEFT JOIN Technicians t ON i.techID = t.techID
       WHERE i.incidentID = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const updateIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, dateClosed } = req.body;

    //validate required fields
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Incident ID is required",
      });
    }

    //bheck if incident exists
    const incidentExists = await req.db.query(
      "SELECT 1 FROM incidents WHERE incidentid = $1",
      [id]
    );

    if (incidentExists.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    //build the update query dynamically based on provided fields
    let query = "UPDATE incidents SET ";
    const params = [];
    let paramIndex = 1;
    let updates = [];

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }

    if (dateClosed !== undefined) {
      if (dateClosed === null) {
        updates.push(`dateclosed = NULL`);
      } else {
        updates.push(`dateclosed = $${paramIndex}`);
        params.push(new Date(dateClosed));
        paramIndex++;
      }
    }

    //if no valid fields to update
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    query += updates.join(", ");
    query += ` WHERE incidentid = $${paramIndex} RETURNING *`;
    params.push(id);

    //execute the update
    const { rows } = await req.db.query(query, params);

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    //handle foreign key violations
    if (err.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Invalid reference (customer, product, or technician)",
      });
    }
    next(err);
  }
};
