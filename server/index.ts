import express from 'express';
import cors from 'cors';
import { MySQLStorage } from './db/mysqlStorage';

const app = express();
const storage = new MySQLStorage();

app.use(cors());
app.use(express.json());

// 添加健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, password, code } = req.body;
    console.log('Registration attempt:', { name, code });
    
    if (code !== '0000') {
      const isValidCode = await storage.validateInviteCode(code);
      if (!isValidCode) {
        console.log('Invalid invitation code:', code);
        return res.status(400).json({ error: 'Invalid invitation code' });
      }
    }

    const success = await storage.createUser(name, password, code);
    if (success) {
      if (code !== '0000') {
        await storage.markInviteCodeAsUsed(code);
      }
      console.log('Registration successful for user:', name);
      res.json({ success: true });
    } else {
      console.log('Registration failed for user:', name);
      res.status(400).json({ error: 'Registration failed' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log('Login attempt:', { name });
    
    const user = await storage.findUserByName(name);
    
    if (user && user.password === password) {
      console.log('Login successful for user:', name);
      res.json({ success: true });
    } else {
      console.log('Login failed for user:', name);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/invite-code', async (req, res) => {
  try {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const success = await storage.createInviteCode(code, expiresAt);
    if (success) {
      console.log('Invite code generated:', code);
      res.json({ code });
    } else {
      console.log('Failed to generate invite code');
      res.status(500).json({ error: 'Failed to generate invitation code' });
    }
  } catch (error) {
    console.error('Invite code generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});