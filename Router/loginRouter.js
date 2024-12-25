import express from "express";
import { userLogin } from "../Controller/registerController.js";

const router = express.Router();

router.post("/", userLogin);

export default router;
