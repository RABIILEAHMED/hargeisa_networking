import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function BuyTicket() {
  const { token } = useContext(AuthContext);

  const [method, setMethod] = useState("zaad");
  const [phone, setPhone] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  const price = 5; // USD

  const handleBuy = async () => {
    if (!phone || !reference) {
      return toast.error("Fill all fields ❌");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/tickets",
        {
          type: "event",
          price,
          paymentMethod: method,
          paymentPhone: phone,
          paymentReference: reference,
        },
        {
          headers: { Authorization: token },
        }
      );

      toast.success("Ticket submitted! Waiting approval ⏳");

      setPhone("");
      setReference("");
    } catch (err) {
      toast.error("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const paymentNumbers = {
    zaad: "25263XXXXXXX",
    evc: "25261XXXXXXX",
    edahab: "25265XXXXXXX",
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white/5 rounded-2xl border border-white/10">

      <h2 className="text-xl font-bold mb-4 text-yellow-400">
        💳 Buy Ticket
      </h2>

      {/* METHOD */}
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="w-full p-2 rounded bg-black border border-white/20 mb-3"
      >
        <option value="zaad">ZAAD</option>
        <option value="evc">EVC Plus</option>
        <option value="edahab">EDAHAB</option>
      </select>

      {/* PAYMENT INFO */}
      <div className="text-sm text-gray-400 mb-3">
        <p>Send <span className="text-yellow-400">${price}</span> to:</p>
        <p className="text-green-400 font-semibold">
          {paymentNumbers[method]}
        </p>
      </div>

      {/* INPUTS */}
      <input
        type="text"
        placeholder="Your Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-2 mb-2 rounded bg-black border border-white/20"
      />

      <input
        type="text"
        placeholder="Transaction Reference"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-black border border-white/20"
      />

      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-yellow-400 text-black py-2 rounded-xl font-semibold hover:bg-yellow-300 transition"
      >
        {loading ? "Processing..." : "Confirm Payment"}
      </button>

    </div>
  );
}