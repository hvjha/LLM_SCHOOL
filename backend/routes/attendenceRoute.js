import express from "express";

const attendenceRoute = express.Router();

import authToken from "../middlewares/authMiddleware.js";
import { permit } from "../middlewares/roleMiddleware.js";
import { markAttendance } from "../controllers/attendence/markAttendence.js";
import { getStudentAttendance } from "../controllers/attendence/getStudent Attendence.js";
import { getCourseAttendance } from "../controllers/attendence/getCourseAttendence.js";
import { getAttendanceByDate } from "../controllers/attendence/getAttendencebyDate.js";
import { updateAttendance } from "../controllers/attendence/updateAttendence.js";
import { deleteAttendance } from "../controllers/attendence/deleteAttendence.js";

// Mark attendance — Trainers and Superadmin only
attendenceRoute.post(
  "/mark",
  authToken,
  permit("trainer", "superadmin"),
  markAttendance
);

// Get student attendance — authenticated users (students view own, trainers/admins view any)
attendenceRoute.get("/student/:studentId", authToken, getStudentAttendance);

// Get course attendance — trainers & admins
attendenceRoute.get(
  "/course/:courseId",
  authToken,
  permit("trainer", "superadmin"),
  getCourseAttendance
);

// Get attendance by date — trainers & admins
attendenceRoute.get(
  "/date/:date",
  authToken,
  permit("trainer", "superadmin"),
  getAttendanceByDate
);

// Update attendance status — Superadmin only
attendenceRoute.put(
  "/:attendanceId",
  authToken,
  permit("superadmin"),
  updateAttendance
);

// Delete attendance — Superadmin only
attendenceRoute.delete(
  "/:attendanceId",
  authToken,
  permit("superadmin"),
  deleteAttendance
);

export default attendenceRoute;