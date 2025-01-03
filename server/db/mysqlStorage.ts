import { pool } from './config';
import { RowDataPacket, OkPacket } from 'mysql2/promise';
import { User } from '../types';

interface UserRow extends RowDataPacket, User {}

export class MySQLStorage {
  async findUserByName(name: string): Promise<User | undefined> {
    try {
      const [rows] = await pool.execute<UserRow[]>(
        'SELECT * FROM users WHERE name = ?',
        [name]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  async createUser(name: string, password: string, code: string): Promise<boolean> {
    try {
      const [result] = await pool.execute<OkPacket>(
        'INSERT INTO users (name, password, invite_code) VALUES (?, ?, ?)',
        [name, password, code]
      );
      console.log('User created successfully:', result);
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }

  async validateInviteCode(code: string): Promise<boolean> {
    try {
      const [rows] = await pool.execute<UserRow[]>(
        'SELECT * FROM invitation_codes WHERE code = ? AND used = FALSE AND expires_at > NOW()',
        [code]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Error validating invite code:', error);
      return false;
    }
  }

  async markInviteCodeAsUsed(code: string): Promise<boolean> {
    try {
      await pool.execute<OkPacket>(
        'UPDATE invitation_codes SET used = TRUE WHERE code = ?',
        [code]
      );
      return true;
    } catch (error) {
      console.error('Error marking invite code as used:', error);
      return false;
    }
  }

  async createInviteCode(code: string, expiresAt: Date): Promise<boolean> {
    try {
      const [result] = await pool.execute<OkPacket>(
        'INSERT INTO invitation_codes (code, expires_at) VALUES (?, ?)',
        [code, expiresAt]
      );
      console.log('Invite code created successfully:', result);
      return true;
    } catch (error) {
      console.error('Error creating invite code:', error);
      return false;
    }
  }
}