// src/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from './models/user';

export const register = [
  body('username').isString().notEmpty(),
  body('password').isString().isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);
      await User.create({ username, password: hashedPassword });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const login = [
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Invalid username or password' });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
      });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const authenticate = (req: Request, res: Response, next: () => void) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
