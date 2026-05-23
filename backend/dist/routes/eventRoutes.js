"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../config/prisma"));
const router = (0, express_1.Router)();
// GET ALL
router.get('/', async (req, res) => {
    try {
        const events = await prisma_1.default.event.findMany({
            include: {
                category: true,
                pembicara: true
            }
        });
        res.json(events);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// CREATE (POST)
router.post('/', async (req, res) => {
    const { name, tanggal, description, categoryId, pembicaraId } = req.body;
    try {
        const newEvent = await prisma_1.default.event.create({
            data: {
                name,
                tanggal: new Date(tanggal),
                description,
                categoryId: Number(categoryId),
                pembicaraId: Number(pembicaraId)
            }
        });
        res.status(201).json(newEvent);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// UPDATE (PUT)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, tanggal, description, categoryId, pembicaraId } = req.body;
    try {
        const updated = await prisma_1.default.event.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
                tanggal: tanggal ? new Date(tanggal) : undefined,
                categoryId: categoryId ? Number(categoryId) : undefined,
                pembicaraId: pembicaraId ? Number(pembicaraId) : undefined
            }
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// DELETE
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.default.event.delete({ where: { id: Number(id) } });
        res.json({ message: 'Event berhasil dihapus' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
