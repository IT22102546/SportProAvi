import express from "express";
import {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician
} from "../controllers/technician.controller.js";

const router = express.Router();

router.get("/", getTechnicians);
router.get("/:id", getTechnicianById);
router.post("/", createTechnician);
router.put("/:id", updateTechnician);
router.delete("/:id", deleteTechnician);

export default router;