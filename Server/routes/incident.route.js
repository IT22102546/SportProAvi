import express from "express";
import {
  assignTechnician,
  createIncident,
  getIncidentById,
  getIncidents,
  updateIncident,
} from "../controllers/incident.controller.js";

const router = express.Router();

router.post("/", createIncident);
router.put("/:id/assign", assignTechnician);
router.get("/", getIncidents);
router.get("/:id", getIncidentById);
router.put("/:id", updateIncident);

export default router;
