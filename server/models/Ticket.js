const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    unique: true // 🔥 HAL TICKET OO KALIYA
  },
  type: {
    type: String,
    enum: ["normal", "vip", "skilled"],
    default: "normal",
  },
  paymentMethod: {
    type: String,
    enum: ["zaad", "evc", "edahab"],
  },
  price: Number,
  paymentPhone: String,
  paymentReference: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  qrCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);