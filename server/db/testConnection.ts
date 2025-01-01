import { pool } from './config';

async function testDatabaseConnection() {
  try {
    // Test connection
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    
    // Create tables if they don't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        invite_code VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS invitation_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE
      )
    `);

    // Test insert
    const testUser = {
      name: 'test_user_' + Date.now(),
      password: 'test_password',
      invite_code: '0000'
    };

    await connection.query(
      'INSERT INTO users (name, password, invite_code) VALUES (?, ?, ?)',
      [testUser.name, testUser.password, testUser.invite_code]
    );
    console.log('Test user inserted successfully');

    // Test select
    const [rows] = await connection.query('SELECT * FROM users WHERE name = ?', [testUser.name]);
    console.log('Retrieved test user:', rows);

    // Test delete
    await connection.query('DELETE FROM users WHERE name = ?', [testUser.name]);
    console.log('Test user deleted successfully');

    connection.release();
    console.log('All database operations completed successfully');
    
    return true;
  } catch (error) {
    console.error('Database test failed:', error);
    return false;
  }
}

// Run the test
testDatabaseConnection().then((success) => {
  if (success) {
    console.log('Database connection and operations test passed');
  } else {
    console.log('Database connection and operations test failed');
  }
  process.exit();
});