import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user.id, email: user.email });
  res.cookie('token', token, { httpOnly: true, secure: false });
  res.json({ message: 'Logged in successfully' });
};

export const profile = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ user });
};
