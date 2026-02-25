const pool = require("../config/database");
const ALLOWED_STATUS_MAP = {
  present: "present",
  absent: "absent",
  absent_unexcused: "absent",
  excused: "excused",
  absent_excused: "excused",
};

const normalizeAttendanceStatus = (status) => {
  const value = String(status || "").trim().toLowerCase();
  return ALLOWED_STATUS_MAP[value] || null;
};

const getWeeklySchedule = async (req, res) => {
  const professorId = req.params.id;
  if (Number(req.user?.sub) !== Number(professorId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        c.course_name,
        g.group_number,
        s.day_of_week,
        s.start_time,
        s.end_time
      FROM sessions s
      JOIN groups g ON s.group_id = g.id
      JOIN courses c ON g.course_id = c.id
      WHERE c.professor_id = $1
      ORDER BY s.day_of_week, s.start_time
      `,
      [professorId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSessionStudents = async (req, res) => {
  const sessionId = Number(req.params.sessionId);
  const professorId = Number(req.user?.sub);

  if (!Number.isInteger(sessionId)) {
    return res.status(400).json({ message: "Invalid session id" });
  }

  try {
    const sessionResult = await pool.query(
      `
      SELECT 
        cs.id AS session_id,
        cs.session_date,
        cs.session_number,
        cg.id AS course_group_id,
        cg.group_number,
        cg.semester,
        c.course_name,
        c.course_code
      FROM class_sessions cs
      JOIN course_groups cg ON cs.course_group_id = cg.id
      JOIN courses c ON cg.course_id = c.id
      WHERE cs.id = $1
        AND cg.professor_id = $2
      `,
      [sessionId, professorId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    const studentsResult = await pool.query(
      `
      SELECT
        s.id,
        s.student_number,
        s.first_name,
        s.last_name,
        s.major,
        s.status,
        s.photo_url,
        a.status AS attendance_status
      FROM class_sessions cs
      JOIN enrollments e ON e.course_group_id = cs.course_group_id
      JOIN students s ON s.id = e.student_id
      LEFT JOIN attendance a
        ON a.student_id = s.id
       AND a.session_id = cs.id
      WHERE cs.id = $1
      ORDER BY s.last_name, s.first_name
      `,
      [sessionId]
    );

    res.json({
      session: sessionResult.rows[0],
      students: studentsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfessorSessions = async (req, res) => {
  const professorId = Number(req.params.professorId);
  if (Number(req.user?.sub) !== professorId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (!Number.isInteger(professorId)) {
    return res.status(400).json({ message: "Invalid professor id" });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        cs.id AS session_id,
        cs.session_date,
        cs.session_number,
        cg.id AS course_group_id,
        cg.group_number,
        cg.semester,
        c.course_name,
        c.course_code
      FROM class_sessions cs
      JOIN course_groups cg ON cs.course_group_id = cg.id
      JOIN courses c ON cg.course_id = c.id
      WHERE cg.professor_id = $1
      ORDER BY cs.session_date ASC, cs.session_number ASC
      `,
      [professorId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSessionAttendance = async (req, res) => {
  const sessionId = Number(req.params.sessionId);
  const professorId = Number(req.user?.sub);

  if (!Number.isInteger(sessionId)) {
    return res.status(400).json({ message: "Invalid session id" });
  }

  const bodyRecords = Array.isArray(req.body?.records) ? req.body.records : null;
  const incomingRecords = bodyRecords || [
    {
      studentId: req.body?.studentId,
      status: req.body?.status,
    },
  ];

  const normalizedRecords = incomingRecords
    .map((item) => ({
      studentId: Number(item?.studentId),
      status: normalizeAttendanceStatus(item?.status),
    }))
    .filter((item) => Number.isInteger(item.studentId) && item.status);

  if (normalizedRecords.length === 0) {
    return res.status(400).json({ message: "No valid attendance records provided" });
  }

  const uniqueStudentIds = [...new Set(normalizedRecords.map((item) => item.studentId))];

  const client = await pool.connect();
  try {
    const sessionResult = await client.query(
      `
      SELECT
        cs.id AS session_id,
        cs.course_group_id
      FROM class_sessions cs
      JOIN course_groups cg ON cs.course_group_id = cg.id
      WHERE cs.id = $1
        AND cg.professor_id = $2
      `,
      [sessionId, professorId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    const courseGroupId = sessionResult.rows[0].course_group_id;
    const enrollmentResult = await client.query(
      `
      SELECT student_id
      FROM enrollments
      WHERE course_group_id = $1
        AND student_id = ANY($2::int[])
      `,
      [courseGroupId, uniqueStudentIds]
    );

    const allowedIds = new Set(enrollmentResult.rows.map((row) => Number(row.student_id)));
    const invalidIds = uniqueStudentIds.filter((id) => !allowedIds.has(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "Some students are not enrolled in this class session",
        invalidStudentIds: invalidIds,
      });
    }

    await client.query("BEGIN");

    const updatedRows = [];
    for (const record of normalizedRecords) {
      const result = await client.query(
        `
        INSERT INTO attendance (student_id, session_id, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (student_id, session_id)
        DO UPDATE SET status = EXCLUDED.status
        RETURNING id, student_id, session_id, status
        `,
        [record.studentId, sessionId, record.status]
      );
      updatedRows.push(result.rows[0]);
    }

    await client.query("COMMIT");
    return res.json({
      message: "Attendance saved successfully",
      updatedCount: updatedRows.length,
      records: updatedRows,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

module.exports = {
  getWeeklySchedule,
  getSessionStudents,
  getProfessorSessions,
  updateSessionAttendance,
};
