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
        const categories = await prisma_1.default.category.findMany();
        res.json(categories);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// CREATE (POST)
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const newCategory = await prisma_1.default.category.create({ data: { name } });
        res.status(201).json(newCategory);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// UPDATE (PUT)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updated = await prisma_1.default.category.update({
            where: { id: Number(id) },
            data: { name }
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
        await prisma_1.default.category.delete({ where: { id: Number(id) } });
        res.json({ message: 'Kategori berhasil dihapus' });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;
