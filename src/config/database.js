import { Pool } from 'pg';
import { config } from './env.js';

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
});

const query = (text, params) => pool.query(text, params);

const getClient = () => pool.connect();

export { query, getClient, pool };
