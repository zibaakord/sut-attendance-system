const express = require("express");

const { getStudentDashboard } = require("../controllers/student.controller");

const router = express.Router();

router.get("/:studentId/dashboard", getStudentDashboard);

module.exports = router;
