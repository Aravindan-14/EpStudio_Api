import { promisePool as db } from "../config/db.js";

// Create Products to Database
export const createProduct = (req, res) => {
  const file = req.files;
  if (!file) {
    return res.status(400).send({ message: "Please Upload files" });
  }
  const { product_Name, product_Price, description } = req.body;
  const imagePath = file.map((file) => file.filename);
  const imageJson = JSON.stringify(imagePath);

  let sql = "INSERT INTO products (name, price, description,image) VALUES (?)";
  let values = [product_Name, product_Price, description, imageJson];
  db.query(sql, [values], (err, result) => {
    if (err) throw err;
    res.send("Product Card Created...!");
  });
};

//Get all Products from Database
export const getAllProducts = async (req, res) => {
  try {
    const [results, fields] = await db.query("SELECT * FROM products");
    res.json(results);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send("Internal Server Error");
  }
};

//Get One data using ID from database
export const getOneProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM products WHERE id = ?";
    const [results, fields] = await db.query(sql, [id]);
    res.json(results);
  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).send(err.message);
  }
};

//delete product by id
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the product" });
  }
};
