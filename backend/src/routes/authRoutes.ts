import { Router } from 'express';
import prisma from '../config/prisma';

const router = Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { nim, name, password } = req.body;
  try {
    const userExists = await prisma.user.findUnique({ where: { nim } });
    if (userExists) return res.status(400).json({ message: 'NIM sudah terdaftar!' });

    const newUser = await prisma.user.create({
      data: { nim, name, password }
    });
    res.status(201).json({ message: 'Registrasi berhasil', user: newUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { nim, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { nim } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'NIM atau Password salah!' });
    }
    res.json({ message: 'Login sukses', user: { nim: user.nim, name: user.name } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL USERS
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { nim: true, name: true, createdAt: true }
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { nim: true, name: true, createdAt: true }
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { nim: true, name: true, createdAt: true }
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;