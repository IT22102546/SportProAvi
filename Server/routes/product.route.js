import express from "express";
import {
  getProducts,
  getProductByCode,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:code", getProductByCode);
router.post("/", createProduct);
router.put("/:code", updateProduct);
router.delete("/:code", deleteProduct);

export default router;