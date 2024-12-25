import express from "express";
import { userRegister,ValidToken } from "../Controller/registerController.js";
import AuthToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", userRegister);
router.post("/validtoken", AuthToken, ValidToken);

export default router;
