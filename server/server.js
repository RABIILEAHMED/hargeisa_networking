require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// ==============================
// 📦 ROUTES
// ==============================
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();
const server = http.createServer(app);

// ==============================
// 🔌 DATABASE
// ==============================
connectDB();

// ==============================
// 🌍 ALLOWED ORIGINS
// ==============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://hargeisa-networking.vercel.app"
];

// helper
const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.replace(/\/$/, "");
};

// ==============================
// ⚡ CORS CONFIG
// ==============================
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const cleanOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    console.log("❌ CORS BLOCKED:", cleanOrigin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ==============================
// 🔥 FORCE CORS HEADERS (FINAL FIX)
// ==============================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(normalizeOrigin(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

// ==============================
// ⚡ MIDDLEWARE
// ==============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ==============================
// 📁 STATIC FILES
// ==============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// 📦 API ROUTES
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/gallery", galleryRoutes);

// ==============================
// 🧪 HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 API Running Successfully"
  });
});

// ==============================
// 🔥 SOCKET.IO (FINAL FIX)
// ==============================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"] // ✅ FIXED (polling removed)
});

app.set("io", io);

// ==============================
// 🔥 REALTIME SYSTEM
// ==============================
let connectedUsers = 0;
let queuePositions = {};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  connectedUsers++;
  io.emit("users", { total: connectedUsers });

  socket.emit("notification", {
    message: "🔥 Connected to realtime server!"
  });

  // JOIN QUEUE
  socket.on("joinQueue", (userId) => {
    if (!userId) return;

    if (queuePositions[userId]) {
      return socket.emit("queueUpdate", {
        position: queuePositions[userId]
      });
    }

    const position = Object.keys(queuePositions).length + 1;
    queuePositions[userId] = position;

    socket.emit("queueUpdate", { position });

    io.emit("queueCount", {
      total: Object.keys(queuePositions).length
    });
  });

  // NOTIFICATION
  socket.on("sendNotification", (msg) => {
    io.emit("notification", { message: msg });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    connectedUsers = Math.max(connectedUsers - 1, 0);

    io.emit("users", { total: connectedUsers });

    console.log("❌ User disconnected:", socket.id);
  });
});

// ==============================
// ❌ 404
// ==============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ==============================
// 🚨 ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// ==============================
// 🚀 START SERVER
// ==============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});