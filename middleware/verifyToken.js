import { promisePool as db } from "../config/db.js";
import Jwt from "jsonwebtoken";

const AuthToken = async (req, res, next) => {
  const authorizationHeader =
    req.headers.authorization || req.headers.Authorization; // Case-insensitive check


  if (!authorizationHeader) {
    return res.send(
      JSON.stringify({
        code: 400,
        status: "error",
        message: "token is missing",
      })
    );
  }

  try {
    // Extract the token from the "Bearer" prefix
    const token = authorizationHeader.split(" ")[1];

    const decoded = Jwt.verify(token, process.env.ACTIVATION_SECRET);

    const user = "SELECT * FROM user WHERE id=?";
    const [rows] = await db.query(user, [decoded.id]);


    if (!rows[0]) {
      return res.send(
        JSON.stringify({
          code: 401,
          status: "not found",
          message: "user not found",
        })
      );
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.send(
      JSON.stringify({
        code: 401,
        status: "invalid",
        message: "invalid token",
      })
    );
  }
};
export default AuthToken;
