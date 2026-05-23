import { Router } from 'express';
import prisma from '../config/prisma';

const router = Router();

// GET ALL
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        category: true,
        pembicara: true
      }
    });
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE (POST)
router.post('/', async (req, res) => {
  const { name, tanggal, description, categoryId, pembicaraId } = req.body;
  try {
    const newEvent = await prisma.event.create({
      data: {
        name,
        tanggal: new Date(tanggal),
        description,
        categoryId: Number(categoryId),
        pembicaraId: Number(pembicaraId)
      }
    });
    res.status(201).json(newEvent);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, tanggal, description, categoryId, pembicaraId } = req.body;
  try {
    const updated = await prisma.event.update({
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
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({ where: { id: Number(id) } });
    res.json({ message: 'Event berhasil dihapus' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;