import { Router } from 'express';
import prisma from '../config/prisma';

const router = Router();

// GET ALL
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE (POST)
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.category.create({ data: { name } });
    res.status(201).json(newCategory);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name }
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: Number(id) } });
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;