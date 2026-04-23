import Attendance from "../../models/attendence/attendence.js";
import courseModel from "../../models/course/courseModel.js";
import userModel from "../../models/user/userModel.js";

const normalizeDate = (dateString) => {
  const date = new Date(dateString + "T00:00:00.000Z");
  return date;
};

/**
 * Returns true if the given UTC date falls on a weekend (Saturday=6 or Sunday=0).
 */
const isWeekend = (date) => {
  const day = date.getUTCDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

// Mark Attendance — Trainers & Superadmin only
export const markAttendance = async (req, res) => {
  try {
    // ── Role Guard ────────────────────────────────────────────────────────────
    const allowedRoles = ["trainer", "superadmin"];
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only trainers and admins can mark attendance",
      });
    }

    const { studentId, courseId, date, status } = req.body;

    if (!studentId || !courseId || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch student and course by Mongo _id
    const student = await userModel.findById(studentId);
    const course = await courseModel.findById(courseId);

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if student is enrolled using Mongo _id
    const isEnrolled = course.students.some(
      (s) => s.toString() === student._id.toString()
    );
    if (!isEnrolled) {
      return res.status(400).json({
        message: "Student not enrolled in this course",
      });
    }

    // Normalize date to UTC midnight
    const attendanceDate = normalizeDate(date);

    // ── Working Day Check (Monday–Friday only) ────────────────────────────────
    if (isWeekend(attendanceDate)) {
      return res.status(400).json({
        success: false,
        message:
          "Attendance cannot be marked on weekends (Saturday / Sunday). Working days are Monday to Friday.",
      });
    }

    // ── Future Date Check ─────────────────────────────────────────────────────
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (attendanceDate > today) {
      return res.status(400).json({
        success: false,
        message: "Cannot mark attendance for future dates",
      });
    }

    // ── Trainer Course Ownership Check ────────────────────────────────────────
    // Trainers can only mark attendance for courses they own
    if (req.user.role === "trainer") {
      const isOwner =
        course.trainer?.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only mark attendance for your own courses",
        });
      }
    }

    // ── Duplicate Check ───────────────────────────────────────────────────────
    const existing = await Attendance.findOne({
      course: course._id,
      student: student._id,
      date: attendanceDate,
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for this date",
      });
    }

    // ── Create Attendance Record ──────────────────────────────────────────────
    const attendance = await Attendance.create({
      course: course._id,
      student: student._id,
      date: attendanceDate,
      status: status || "present",
      markedBy: req.user._id,
    });

    // Populate for response
    await attendance.populate([
      { path: "course", select: "name courseId" },
      { path: "student", select: "name studentId email" },
      { path: "markedBy", select: "name trainerId" },
    ]);

    return res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (err) {
    console.error("Attendance error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};