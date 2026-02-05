const db = require('../config/database');

exports.login = async (email, password) => {
  const result = await db.query(
    'SELECT id, email, password, role FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const user = result.rows[0];

  if (user.password !== password) {
    throw new Error('Invalid credentials');
  }

  return {
    token: 'FAKE_JWT_TOKEN',
    user: {
      id: user.id,
      role: user.role,
      email: user.email
    }
  };
};
