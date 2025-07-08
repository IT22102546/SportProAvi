export const getProducts = async (req, res, next) => {
  try {
    const { rows } = await req.db.query("SELECT * FROM Products");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const getProductByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { rows } = await req.db.query(
      "SELECT * FROM Products WHERE productCode = $1",
      [code]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { productCode, name, version, releaseDate } = req.body;
    const { rows } = await req.db.query(
      `INSERT INTO Products (productCode, name, version, releaseDate)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [productCode, name, version, releaseDate]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, version, releaseDate } = req.body;
    const { rows } = await req.db.query(
      `UPDATE Products 
       SET name = $1, version = $2, releaseDate = $3 
       WHERE productCode = $4 RETURNING *`,
      [name, version, releaseDate, code]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { rowCount } = await req.db.query(
      "DELETE FROM Products WHERE productCode = $1",
      [code]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};