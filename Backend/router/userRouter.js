import express from "express";
import { studentRegister } from "../controllers/userController.js";
const router = express.Router();

router.post("/student/register", studentRegister);

export default router;