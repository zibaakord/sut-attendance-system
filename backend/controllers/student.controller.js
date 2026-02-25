const pool = require("../config/database");

const getStudentDashboard = async (req, res) => {
  const studentId = Number(req.params.studentId);

  if (!Number.isInteger(studentId)) {
    return res.status(400).json({ message: "Invalid student id" });
  }

  if (Number(req.user?.sub) !== studentId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const studentResult = await pool.query(
      `
      SELECT id, student_number, first_name, last_name, major, status, photo_url
      FROM students
      WHERE id = $1
      `,
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const coursesResult = await pool.query(
      `
      SELECT
        c.course_name,
        c.course_code,
        c.credits,
        cg.group_number,
        cg.semester,
        CONCAT(p.first_name, ' ', p.last_name) AS instructor,
        COUNT(cs.id)::int AS sessions_held,
        COUNT(
          CASE
            WHEN a.status IN ('present', 'late', 'excused') THEN 1
          END
        )::int AS sessions_attended,
        COALESCE(
          ROUND(
            (
              COUNT(
                CASE
                  WHEN a.status IN ('present', 'late', 'excused') THEN 1
                END
              )::numeric * 100.0
            ) / NULLIF(COUNT(cs.id), 0)
          ),
          0
        )::int AS attendance_rate
      FROM enrollments e
      JOIN course_groups cg ON cg.id = e.course_group_id
      JOIN courses c ON c.id = cg.course_id
      JOIN professors p ON p.id = cg.professor_id
      LEFT JOIN class_sessions cs ON cs.course_group_id = cg.id
      LEFT JOIN attendance a
        ON a.session_id = cs.id
       AND a.student_id = e.student_id
      WHERE e.student_id = $1
      GROUP BY
        c.id, c.course_name, c.course_code, c.credits,
        cg.group_number, cg.semester, p.first_name, p.last_name
      ORDER BY c.course_name ASC
      `,
      [studentId]
    );

    const courses = coursesResult.rows.map((course) => {
      let status = "Good";
      if (course.attendance_rate < 75) status = "At Risk";
      else if (course.attendance_rate < 90) status = "Warning";
      else if (course.attendance_rate >= 98) status = "Excellent";

      return {
        ...course,
        status,
      };
    });

    const totalCourses = courses.length;
    const avgAttendance = totalCourses
      ? Math.round(
          courses.reduce((sum, course) => sum + Number(course.attendance_rate), 0) /
            totalCourses
        )
      : 0;
    const lowAttendanceCourses = courses.filter(
      (course) => Number(course.attendance_rate) < 75
    ).length;

    return res.json({
      student: studentResult.rows[0],
      summary: {
        totalCourses,
        avgAttendance,
        lowAttendanceCourses,
      },
      courses,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStudentDashboard };
