import express from "express";
import {
  getProducts,
  getProductByCode,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authorizeRoles, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, getProducts);
router.get("/:code", verifyToken, getProductByCode);
router.post("/", verifyToken, authorizeRoles("admin"), createProduct);
router.put("/:code", verifyToken, authorizeRoles("admin"), updateProduct);
router.delete("/:code", verifyToken, authorizeRoles("admin"), deleteProduct);

export default router;
