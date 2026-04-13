require("dotenv").config(); // ✅ FIRST

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// 🔌 Routes
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();

// 🔌 Connect DB
connectDB();

// ⚡ Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Static folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 📦 Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/gallery", galleryRoutes);

// 🏠 Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ⚡ CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 📌 Global io
app.set("io", io);

// ==============================
// 🔥 REALTIME SYSTEM
// ==============================

let connectedUsers = 0;
let queuePositions = {};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  connectedUsers++;

  socket.emit("notification", {
    message: "🔥 Connected to realtime server!"
  });

  io.emit("users", { total: connectedUsers });

  socket.on("joinQueue", (userId) => {
    const position = Object.keys(queuePositions).length + 1;
    queuePositions[userId] = position;

    socket.emit("queueUpdate", { position });

    console.log(`User ${userId} joined queue at position ${position}`);
  });

  const interval = setInterval(() => {
    Object.keys(queuePositions).forEach((userId) => {
      if (queuePositions[userId] > 1) queuePositions[userId]--;
    });

    io.emit("queueUpdateGlobal", queuePositions);
  }, 5000);

  socket.on("sendNotification", (msg) => {
    io.emit("notification", { message: msg });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    connectedUsers--;

    io.emit("users", { total: connectedUsers });

    clearInterval(interval);
  });
});

// ==============================
// 🚀 START SERVER
// ==============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});