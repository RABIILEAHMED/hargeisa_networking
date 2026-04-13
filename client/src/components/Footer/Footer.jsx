import React, { useState, useEffect } from "react";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  // 🔝 SCROLL DETECTION
  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* FOOTER */}
      <footer className="relative text-white mt-10 overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

        {/* LIGHT EFFECT (SMALLER) */}
        <div className="absolute w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl top-0 left-0"></div>
        <div className="absolute w-40 h-40 bg-blue-500/10 rounded-full blur-3xl bottom-0 right-0"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-8">

          {/* TOP */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* LEFT */}
            <div>
              <h1 className="text-xl font-bold text-yellow-400">
                🚀 Event Gallery
              </h1>

              <p className="text-gray-400 text-xs mt-2 max-w-sm">
                Modern real-time gallery for sharing event memories.
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-400">
                Built by Khalid Ahmed
              </p>

              <a
                href="https://khalidportifolio.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-xs bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
              >
                Portfolio
              </a>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="flex justify-center gap-6 mt-6 text-xs">

            <a
              href="https://www.facebook.com/profile.php?id=61581978779295"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition"
            >
              🌐 Facebook
            </a>

            <a
              href="https://khalidportifolio.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-400 transition"
            >
              💼 Portfolio
            </a>

            <span className="text-gray-500">📸 Gallery</span>
          </div>

          {/* BOTTOM */}
          <div className="border-t border-gray-800 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500">

            <p>
              © {new Date().getFullYear()} Event Gallery
            </p>

            <p className="mt-1 md:mt-0">
              MERN Stack ⚡
            </p>
          </div>
        </div>
      </footer>

      {/* 🔝 BACK TO TOP */}
      {showTop && (
        <button
          onClick={scrollTop}
          className="fixed bottom-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-black shadow-lg hover:scale-110 transition z-50"
        >
          ⬆
        </button>
      )}
    </>
  );
}