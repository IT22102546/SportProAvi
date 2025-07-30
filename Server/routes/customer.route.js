import express from "express";
import {
  getCustomers,
  searchCustomers,
  getCustomerById,
  updateCustomer,
  customerLogin,
} from "../controllers/customer.controller.js";
import { verifyToken, authorizeRoles } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin"), getCustomers);
router.get("/search", verifyToken, authorizeRoles("admin"), searchCustomers);
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "customer"),
  getCustomerById
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "customer"),
  updateCustomer
);
router.post("/login", verifyToken, authorizeRoles("admin"), customerLogin);

export default router;
