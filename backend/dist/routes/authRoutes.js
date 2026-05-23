"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../config/prisma"));
const router = (0, express_1.Router)();
// REGISTER
router.post('/register', async (req, res) => {
    const { nim, name, password } = req.body;
    try {
        const userExists = await prisma_1.default.user.findUnique({ where: { nim } });
        if (userExists)
            return res.status(400).json({ message: 'NIM sudah terdaftar!' });
        const newUser = await prisma_1.default.user.create({
            data: { nim, name, password }
        });
        res.status(201).json({ message: 'Registrasi berhasil', user: newUser });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// LOGIN
router.post('/login', async (req, res) => {
    const { nim, password } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({ where: { nim } });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'NIM atau Password salah!' });
        }
        res.json({ message: 'Login sukses', user: { nim: user.nim, name: user.name } });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET ALL USERS
router.get('/users', async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: { nim: true, name: true, createdAt: true }
        });
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/users', async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: { nim: true, name: true, createdAt: true }
        });
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/users', async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: { nim: true, name: true, createdAt: true }
        });
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
