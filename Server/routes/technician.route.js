import express from "express";
import {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
} from "../controllers/technician.controller.js";
import { authorizeRoles, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "technician"),
  getTechnicians
);
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "technician"),
  getTechnicianById
);
router.post("/", verifyToken, authorizeRoles("admin"), createTechnician);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateTechnician);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteTechnician);

export default router;
