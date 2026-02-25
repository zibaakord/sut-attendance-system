const express = require("express");
const router = express.Router();

const {
  getWeeklySchedule,
  getSessionStudents,
  getProfessorSessions,
  updateSessionAttendance,
} = require("../controllers/professor.controller");

router.get("/:id/schedule", getWeeklySchedule);
router.get("/:professorId/sessions", getProfessorSessions);
router.get("/sessions/:sessionId/students", getSessionStudents);
router.put("/sessions/:sessionId/attendance", updateSessionAttendance);

module.exports = router;
