import msql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = msql.createPool({
  host: process.env.DB_HOSE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export const promisePool = connection.promise();
