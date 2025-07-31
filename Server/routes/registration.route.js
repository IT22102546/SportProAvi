import express from "express";
import {
  getRegistrationsByCustomer,
  registerProduct,
} from "../controllers/registration.controller.js";
import { authorizeRoles, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get(
  "/:customerId",
  verifyToken,
  authorizeRoles("admin", "customer"),
  getRegistrationsByCustomer
);
router.post(
  "/",
  verifyToken,
  authorizeRoles("customer", "admin"),
  registerProduct
);

export default router;
