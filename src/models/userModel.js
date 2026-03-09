import { query } from '../config/database.js';

const getUserByUsername = async (username) => {
  const queryText = 'SELECT * FROM users WHERE username = $1';
  const result = await query(queryText, [username]);

  return result.rows[0] || null;
};

const createUser = async (username, hashedPassword) => {
  const queryText = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username, created_at
  `;

  const result = await query(queryText, [username, hashedPassword]);
  return result.rows[0];
};

export { getUserByUsername, createUser };
