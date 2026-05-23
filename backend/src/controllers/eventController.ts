import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Ambil semua event
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ msg: "Gagal ambil data event" });
  }
};

// 2. Tambah event baru
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, tanggal, description, categoryId, pembicaraId } = req.body;
    
    const newEvent = await prisma.event.create({
      data: {
        name,
        tanggal: new Date(tanggal),
        description,
        categoryId: parseInt(categoryId),
        pembicaraId: parseInt(pembicaraId)
      }
    });
    
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error); // Ini bakal ngebantu lu liat error di terminal backend
    res.status(500).json({ msg: "Gagal nambah event ke database" });
  }
};

// 3. Hapus event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({
      where: { id: parseInt(id as string) }
    });
    res.json({ msg: "Event berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal hapus event" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, tanggal, description } = req.body;
    const updated = await prisma.event.update({
      // Ganti bagian ini:
    where: { id: parseInt(id as string) },
      data: { name, tanggal: new Date(tanggal), description }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: "Gagal update" });
  }
};