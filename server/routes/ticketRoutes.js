const express = require("express");
const router = express.Router();

const Ticket = require("../models/Ticket");

const {
  createTicket,
  approveTicket,
  rejectTicket,
  getMyTickets,
  getPublicTickets,
} = require("../controllers/ticketController");

const admin = require("../middleware/adminMiddleware");
const auth = require("../middleware/authMiddleware");

// ==============================
// PUBLIC TICKETS
// ==============================
router.get("/public", getPublicTickets);

// ==============================
// USER ROUTES
// ==============================
router.post("/", auth, createTicket);
router.get("/my", auth, getMyTickets);

// ==============================
// ADMIN ONLY
// ==============================
router.put("/approve/:id", auth, admin, approveTicket);
router.put("/reject/:id", auth, admin, rejectTicket);

// ==============================
// VERIFY TICKET
// ==============================
router.get("/verify/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("user", "name photo bio jobTitle");

    if (!ticket) {
      return res.status(404).send(`
        <h1 style="color:red;text-align:center;margin-top:50px;">
          ❌ Ticket not found
        </h1>
      `);
    }

    // ✅ FIX IMAGE URL
    const imageUrl = ticket.user.photo
      ? `http://localhost:5000/${ticket.user.photo}`
      : `https://placehold.co/150`;

    return res.send(`
      <div style="font-family:sans-serif;text-align:center;margin-top:50px;">
        <h1>🎟️ Ticket Info</h1>

        <img 
          src="${imageUrl}" 
          alt="Profile"
          onerror="this.onerror=null;this.src='https://placehold.co/150';"
          style="width:100px;height:100px;border-radius:50%;margin-bottom:20px;"
        />

        <p><strong>Name:</strong> ${ticket.user.name}</p>
        <p><strong>Title:</strong> ${ticket.user.jobTitle || "N/A"}</p>
        <p><strong>Type:</strong> ${ticket.type}</p>
        <p><strong>Status:</strong> ${ticket.status}</p>
      </div>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error verifying ticket");
  }
});

module.exports = router;