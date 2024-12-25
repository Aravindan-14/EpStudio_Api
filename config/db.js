import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST, // Fixed typo from DB_HOSE
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export const promisePool = connection.promise();

const testDbConnection = async () => {
  try {
    // Try getting a connection from the pool
    const [rows] = await promisePool.query("SELECT 1");
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

// Call the function to test the connection
testDbConnection();
