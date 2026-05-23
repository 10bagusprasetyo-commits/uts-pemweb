import { Router } from 'express';
import prisma from '../config/prisma';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const speakers = await prisma.speaker.findMany();
    res.json(speakers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, role } = req.body;
  try {
    const newSpeaker = await prisma.speaker.create({ data: { name, role } });
    res.status(201).json(newSpeaker);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;
  try {
    const updated = await prisma.speaker.update({
      where: { id: Number(id) },
      data: { name, role }
    });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.speaker.delete({ where: { id: Number(id) } });
    res.json({ message: 'Speaker berhasil dihapus' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;