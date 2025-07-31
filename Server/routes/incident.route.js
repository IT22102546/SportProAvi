import express from "express";
import {
  assignTechnician,
  createIncident,
  getIncidentById,
  getIncidents,
  updateIncident,
} from "../controllers/incident.controller.js";
import { authorizeRoles, verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("customer"), createIncident);
router.put(
  "/:id/assign",
  verifyToken,
  authorizeRoles("customer", "admin"),
  assignTechnician
);
router.get(
  "/",
  verifyToken,
  authorizeRoles("customer", "technician", "admin"),
  getIncidents
);
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("customer", "technician", "admin"),
  getIncidentById
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "technician"),
  updateIncident
);

export default router;
