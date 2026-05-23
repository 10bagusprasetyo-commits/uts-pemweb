"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import rute-rute yang udah lu bikin di folder routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const pembicaraRoutes_1 = __importDefault(require("./routes/pembicaraRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Pasang jalur pintunya (Routing API)
app.use("/api/auth", authRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/events", eventRoutes_1.default);
app.use("/api/speakers", pembicaraRoutes_1.default);
// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server nyala aman di port ${PORT} 🚀`);
});
