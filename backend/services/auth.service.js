const db = require("../config/database");
const { signToken } = require("../utils/token");

const normalizeRole = (role) => {
  if (!role) return null;
  const value = String(role).trim().toUpperCase();
  if (value === "PROFESSOR" || value === "STUDENT") return value;
  return null;
};

const login = async ({ identifier, password, role }) => {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    const error = new Error("Invalid role");
    error.status = 400;
    throw error;
  }

  const trimmedIdentifier = String(identifier || "").trim();
  const trimmedPassword = String(password || "").trim();
  if (!trimmedIdentifier || !trimmedPassword) {
    const error = new Error("Identifier and password are required");
    error.status = 400;
    throw error;
  }

  const query =
    normalizedRole === "PROFESSOR"
      ? `
        SELECT id, email AS identifier, first_name, last_name, password, photo_url
        FROM professors
        WHERE email = $1
      `
      : `
        SELECT id, student_number AS identifier, first_name, last_name, password, photo_url
        FROM students
        WHERE student_number = $1
      `;

  const result = await db.query(query, [trimmedIdentifier]);
  if (result.rows.length === 0) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const user = result.rows[0];
  if (user.password !== trimmedPassword) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = signToken({
    sub: user.id,
    role: normalizedRole,
    identifier: user.identifier,
  });

  return {
    token,
    user: {
      id: user.id,
      role: normalizedRole,
      identifier: user.identifier,
      firstName: user.first_name,
      lastName: user.last_name,
      photoUrl: user.photo_url || null,
    },
  };
};

module.exports = { login, normalizeRole };
