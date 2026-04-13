const Ticket = require("../models/Ticket");
const QRCode = require("qrcode");

// ==============================
// ✅ PUBLIC TICKETS (All, with user info)
// ==============================
exports.getPublicTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", "name email photo bio jobTitle skills")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ==============================
// ✅ APPROVED TICKETS (Attendees)
// ==============================
exports.getApprovedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: "approved" })
      .populate("user", "name photo bio jobTitle skills")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ==============================
// ✅ CREATE TICKET
// ==============================
exports.createTicket = async (req, res) => {
  const { type, paymentPhone } = req.body;
  const prices = { normal: 5, vip: 10, skilled: 15 };

  try {
    const existing = await Ticket.findOne({ user: req.user });

    if (existing) {
      return res.status(400).json({ msg: "You already have a ticket" });
    }

    const ticket = await Ticket.create({
      user: req.user,
      type,
      price: prices[type],
      paymentPhone,
      status: "pending",
    });

    // 🔥 REALTIME
    const io = req.app.get("io");
    if (io) {
      io.emit("ticket:new", {
        message: `🎟️ New ticket from ${ticket.user}`, // fallback (ID)
        ticket,
      });
    }

    res.json({ msg: "Ticket created", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// ==============================
// ✅ APPROVE TICKET
// ==============================
exports.approveTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id)
      .populate("user", "name photo bio jobTitle skills");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    const qrData = `http://localhost:5000/api/tickets/verify/${ticket._id}`;
    const qr = await QRCode.toDataURL(qrData);

    ticket.status = "approved";
    ticket.qrCode = qr;
    await ticket.save();

    // 🔥 RE-FETCH populated data (IMPORTANT FIX)
    ticket = await Ticket.findById(ticket._id).populate("user", "name");

    const io = req.app.get("io");
    if (io) {
      io.emit("ticket:update", {
        message: "Ticket approved",
        userName: ticket.user?.name || "Unknown User",
        ticket,
      });
    }

    res.json({ msg: "Approved", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// ==============================
// ❌ REJECT TICKET
// ==============================
exports.rejectTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id)
      .populate("user", "name");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    ticket.status = "rejected";
    await ticket.save();

    // 🔥 RE-FETCH populated user
    ticket = await Ticket.findById(ticket._id).populate("user", "name");

    const io = req.app.get("io");
    if (io) {
      io.emit("ticket:update", {
        message: "Ticket rejected",
        userName: ticket.user?.name || "Unknown User",
        ticket,
      });
    }

    res.json({ msg: "Rejected", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// ==============================
// ✅ GET MY TICKET
// ==============================
exports.getMyTickets = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ user: req.user })
      .populate("user", "name photo bio jobTitle skills");

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};