import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
host: process.env.DB_HOST || '54.255.48.212',
  user: process.env.DB_USER || 'linky',
  password: process.env.DB_PASSWORD || 'Yingyan.102',
  database: process.env.DB_NAME || 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});