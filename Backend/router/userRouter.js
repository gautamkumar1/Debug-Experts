import express from "express";
import { login, studentRegister } from "../controllers/userController.js";
const router = express.Router();

router.post("/student/register", studentRegister);
router.post("/login", login)

export default router;