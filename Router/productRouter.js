import express from "express";
import multer from "multer";
import path from "path";
import {
  createProduct,
  getAllProducts,
  getOneProducts,
  deleteProductById,
} from "../Controller/productController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Products");
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

router.post("/creaditProduct", upload.array("Product_img", 5), createProduct);
router.get("/allProducts", getAllProducts);
router.get("/:id", getOneProducts);
router.post("/deleteById", deleteProductById);

export default router;
