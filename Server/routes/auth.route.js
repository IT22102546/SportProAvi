import express from "express";
import {
  signUp,
  signIn,
  signOut,
  adminSignIn,
  technicianSignIn,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/admin-sign", adminSignIn);
router.post("/tech-signin", technicianSignIn);
router.post("/signout", signOut);

export default router;
