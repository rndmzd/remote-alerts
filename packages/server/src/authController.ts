import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const users: { [key: string]: string } = {}; // In-memory user storage for simplicity

export const register = [
  body("username").isString().notEmpty(),
  body("password").isString().isLength({ min: 6 }),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    if (users[username]) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    users[username] = hashedPassword;

    res.status(201).json({ message: "User registered successfully" });
  },
];

export const login = [
  body("username").isString().notEmpty(),
  body("password").isString().notEmpty(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = users[username];
    if (!hashedPassword || !bcrypt.compareSync(password, hashedPassword)) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({ token });
  },
];

export const authenticate = (req: Request, res: Response, next: () => void) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
