import express from "express";
import {
  getCustomers,
  searchCustomers,
  getCustomerById,
  updateCustomer,
  customerLogin
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", getCustomers);
router.get("/search", searchCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.post("/login", customerLogin);

export default router;