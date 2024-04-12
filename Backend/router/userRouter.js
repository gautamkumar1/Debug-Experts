import express from "express";
import {
  login,
  studentRegister,
  addNewAdmin,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/student/register", studentRegister);
router.post("/login", login);
router.post("/admin/addnew", addNewAdmin);
export default router;
