import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { query } from '../config/db.js';
import { sanitizeInput } from '../middleware/validators.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { email, password } = loginSchema.parse(body);
    const result = await query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    return res.status(400).json({ message: error?.errors?.[0]?.message || 'Invalid request' });
  }
});

export default router;
