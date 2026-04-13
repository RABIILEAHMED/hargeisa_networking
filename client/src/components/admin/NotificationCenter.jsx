import React, { useState } from "react";

export default function NotificationCenter({ notifications, clearAll }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-xl"
      >
        🔔

        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-black border border-white/10 rounded-xl shadow-xl z-50">

          <div className="p-3 border-b border-white/10 flex justify-between">
            <span className="text-sm text-gray-300">Notifications</span>
            <button onClick={clearAll} className="text-xs text-red-400">
              Clear
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-3 text-gray-400 text-sm">No notifications</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="p-3 border-b border-white/5 text-sm">
                  {n}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}