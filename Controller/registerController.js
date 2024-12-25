import { promisePool as db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegister = async (req, res) => {
  const selectQuery = "SELECT * FROM user WHERE email=?";
  try {
    const [rows] = await db.query(selectQuery, [req.body.email]);
    if (rows.length > 0) {
      return res.send("User Already Exists..");
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds

      const insertQuery =
        "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
      const values = [req.body.name, req.body.email, hashedPassword];
      await db.query(insertQuery, values);
      return res.send("User Added...");
    }
  } catch (err) {
    console.error("Error during registration:", err);
    return res.send("Something went wrong...");
  }
};

const createJWToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "1d" });
};

export const userLogin = async (req, res) => {
  const selectQuery = "SELECT * FROM user WHERE email=?";
  try {
    const [rows] = await db.query(selectQuery, [req.body.email]);
    if (rows.length === 0) {
      return res.send(
        JSON.stringify({
          code: 404,
          status: "faild",
          message: "User Not found",
        })
      );
    } else {
      const user = rows[0];

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      const users = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      if (isPasswordValid) {
        const token = createJWToken(users);
        return res.send(
          JSON.stringify({
            code: 200,
            status: "success",
            message: "Login successful...",
            data: { ...users, token: token },
          })
        );
      }

      return res.send(
        JSON.stringify({
          code: 401,
          status: "faild",
          message: "Invalid password.",
        })
      );
    }
  } catch (err) {
    return res.send(
      JSON.stringify({
        code: 500,
        status: "faild",
        message: "Somthing Went worng..",
      })
    );
  }
};

export const ValidToken = async (req, res) => {
  try {
    return res.send(
      JSON.stringify({
        code: 200,
        status: "success",
        message: "Token Valid",
      })
    );
  } catch (error) {
    return res.send(
      JSON.stringify({
        code: 401,
        status: "error",
        message: error.message,
      })
    );
  }
};
