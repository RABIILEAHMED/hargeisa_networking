import React from "react";

export default function QueueStatus({ position }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">

      <h3 className="text-lg font-semibold text-yellow-400">
        📊 Queue Position
      </h3>

      <p className="text-3xl font-bold mt-2">
        #{position}
      </p>

      <p className="text-gray-400 text-sm">
        Waiting in line...
      </p>

    </div>
  );
}