import express from "express";
import {
  createPurchase,
  getUserOrders,
} from "../Controller/purchaseController.js";
import multer from "multer";
import path from "path";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Customer");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post("/order", upload.single("image"), createPurchase);
router.get("/getUserOrders", getUserOrders);

export default router;
