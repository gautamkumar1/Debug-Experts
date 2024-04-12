import express from "express";
import {
  login,
  studentRegister,
  addNewAdmin,
  getAllExperts,
  getUserDetails,
  logoutStudent,
  logoutAdmin,
  addNewExpert,
} from "../controllers/userController.js";
import { isAdminAuthenticated,isStudentAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
/*
**************************
//* STUDENT REGISTRATION ROUTER
**************************
*/
router.post("/student/register", studentRegister);
/*
**************************
//* LOGIN ROUTER
**************************
*/
router.post("/login", login);
/*
**************************
//* ADD NEW ADMIN ROUTER
**************************
*/
router.post("/admin/addnew", isAdminAuthenticated,addNewAdmin);
/*
**************************
//* GET ALL EXPERTS ROUTER
**************************
*/
router.get("/experts", getAllExperts);
/*
**************************
//* GET ADMIN DETAILS ROUTER
**************************
*/
router.get("/admin/me", isAdminAuthenticated,getUserDetails);
/*
**************************
//* STUDENT GET USER DETAILS ROUTER
**************************
*/
router.get("/student/me", isStudentAuthenticated, getUserDetails);
// Student Logout router
router.get("/student/logout", isStudentAuthenticated, logoutStudent);
// Logout Admin router
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
// ADDED NEW EXPERT
router.post("/expert/addnew", isAdminAuthenticated, addNewExpert);
export default router;
