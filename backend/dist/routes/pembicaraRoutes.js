"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../config/prisma"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const speakers = await prisma_1.default.speaker.findMany();
        res.json(speakers);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/', async (req, res) => {
    const { name, role } = req.body;
    try {
        const newSpeaker = await prisma_1.default.speaker.create({ data: { name, role } });
        res.status(201).json(newSpeaker);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, role } = req.body;
    try {
        const updated = await prisma_1.default.speaker.update({
            where: { id: Number(id) },
            data: { name, role }
        });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.default.speaker.delete({ where: { id: Number(id) } });
        res.json({ message: 'Speaker berhasil dihapus' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
