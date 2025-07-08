import express from "express";
import {
  getRegistrationsByCustomer,
  registerProduct
} from "../controllers/registration.controller.js";

const router = express.Router();

router.get("/:customerId", getRegistrationsByCustomer);
router.post("/", registerProduct);

export default router;