import express from "express";
import {
  signUp,
  customerLogin,
  signOut,
  adminLogin,
  technicianLogin
} from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/signup", signUp); 
router.post("/customer/login", customerLogin); 
router.post("/admin/login", adminLogin); 
router.post("/technician/login", technicianLogin); 
router.post("/signout", signOut); 

export default router;