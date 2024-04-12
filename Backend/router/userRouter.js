import express from "express";
import {
  login,
  studentRegister,
  addNewAdmin,
  getAllExperts,
} from "../controllers/userController.js";
import { isAdminAuthenticated,isStudentAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/student/register", studentRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated,addNewAdmin);
router.get("/experts", getAllExperts);
export default router;
