import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

// Signup
router.post('/signup', async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, phone, country } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ 
      name, 
      email, 
      phone, 
      country, 
      password: hashedPassword 
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId: newUser._id, name: newUser.name });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

export default router;
