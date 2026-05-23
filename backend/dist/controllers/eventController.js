"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEvent = exports.deleteEvent = exports.createEvent = exports.getAllEvents = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 1. Ambil semua event
const getAllEvents = async (req, res) => {
    try {
        const events = await prisma.event.findMany();
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ msg: "Gagal ambil data event" });
    }
};
exports.getAllEvents = getAllEvents;
// 2. Tambah event baru
const createEvent = async (req, res) => {
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
    }
    catch (error) {
        console.error(error); // Ini bakal ngebantu lu liat error di terminal backend
        res.status(500).json({ msg: "Gagal nambah event ke database" });
    }
};
exports.createEvent = createEvent;
// 3. Hapus event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.event.delete({
            where: { id: parseInt(id) }
        });
        res.json({ msg: "Event berhasil dihapus" });
    }
    catch (error) {
        res.status(500).json({ msg: "Gagal hapus event" });
    }
};
exports.deleteEvent = deleteEvent;
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, tanggal, description } = req.body;
        const updated = await prisma.event.update({
            // Ganti bagian ini:
            where: { id: parseInt(id) },
            data: { name, tanggal: new Date(tanggal), description }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ msg: "Gagal update" });
    }
};
exports.updateEvent = updateEvent;
