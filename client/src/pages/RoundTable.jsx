import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const speakers = [
  {
    id: 1,
    name: "Ahmed Ali",
    role: "AI Expert",
    topic: "Future of AI",
    bio: "Expert in Artificial Intelligence with 10+ years experience.",
    image: "https://i.pravatar.cc/300?img=12",
    audio: "/audio/notify.mp3",
  },
  {
    id: 2,
    name: "Fatima Noor",
    role: "Startup Founder",
    topic: "Building Startups",
    bio: "Founder of 3 startups focused on innovation.",
    image: "https://i.pravatar.cc/300?img=32",
    audio: "/audio/startup.mp3",
  },
  {
    id: 3,
    name: "Hassan Mohamed",
    role: "Cyber Security",
    topic: "Security Systems",
    bio: "Cybersecurity specialist protecting modern systems.",
    image: "https://i.pravatar.cc/300?img=45",
    audio: "/audio/security.mp3",
  },
  {
    id: 4,
    name: "Abdi Karim",
    role: "Developer",
    topic: "Modern Web Apps",
    bio: "Fullstack developer building scalable apps.",
    image: "https://i.pravatar.cc/300?img=22",
    audio: "/audio/dev.mp3",
  },
  {
    id: 5,
    name: "Amina Yusuf",
    role: "UX Designer",
    topic: "Design Thinking",
    bio: "UX designer crafting human-centered experiences.",
    image: "https://i.pravatar.cc/300?img=18",
    audio: "/audio/design.mp3",
  },
];

export default function RoundTable() {
  const [angle, setAngle] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const audioRef = useRef(null);

  const playAudio = (src) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(src);
    audio.play();
    audioRef.current = audio;
  };

  useEffect(() => {
    let frame;

    const rotate = () => {
      if (!activeSpeaker) {
        setAngle((prev) => prev + 0.0025);
      }
      frame = requestAnimationFrame(rotate);
    };

    rotate();
    return () => cancelAnimationFrame(frame);
  }, [activeSpeaker]);

  const radius = 240;

  return (
    <div className="relative flex flex-col items-center py-24 overflow-hidden bg-black text-white">

      <h2 className="text-4xl font-bold mb-14 text-yellow-400 tracking-wide">
        🎤 Round Table Experience
      </h2>

      {/* TABLE */}
      <div className="relative w-[650px] h-[650px] flex items-center justify-center">

        {speakers.map((speaker, index) => {
          const theta = (2 * Math.PI * index) / speakers.length + angle;

          const x = radius * Math.cos(theta);
          const y = radius * Math.sin(theta);

          const depth = (y + radius) / (2 * radius);

          // 🔥 Bigger scaling
          const scale = 0.7 + depth * 0.9;
          const opacity = 0.5 + depth * 0.5;

          return (
            <motion.div
              key={speaker.id}
              animate={{ x, y, scale, opacity }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              style={{
                position: "absolute",
                zIndex: Math.floor(depth * 100),
              }}
              onClick={() => {
                setActiveSpeaker(speaker);
                playAudio(speaker.audio);
              }}
              className="cursor-pointer group"
            >
              {/* CARD */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 w-44 text-center shadow-xl 
              group-hover:scale-110 group-hover:shadow-yellow-400/40 transition duration-300">

                {/* IMAGE BIGGER */}
                <img
                  src={speaker.image}
                  className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-yellow-400 shadow-lg 
                  group-hover:shadow-yellow-400/80 transition"
                />

                <h3 className="text-sm font-semibold">
                  {speaker.name}
                </h3>

                <p className="text-xs text-gray-400">
                  {speaker.role}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* CENTER GLOW */}
        <div className="absolute w-72 h-72 bg-yellow-400/20 blur-[120px] rounded-full"></div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {activeSpeaker && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSpeaker(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-black to-gray-900 border border-yellow-400/20 rounded-3xl p-10 w-[750px] max-w-[95%] shadow-2xl relative"
            >
              <div className="flex flex-col md:flex-row gap-10 items-center">

                <img
                  src={activeSpeaker.image}
                  className="w-56 h-56 rounded-2xl border-4 border-yellow-400 shadow-2xl"
                />

                <div>
                  <h2 className="text-4xl font-bold mb-2">
                    {activeSpeaker.name}
                  </h2>

                  <p className="text-gray-400 mb-2">
                    {activeSpeaker.role}
                  </p>

                  <p className="text-yellow-400 mb-4 text-xl">
                    {activeSpeaker.topic}
                  </p>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {activeSpeaker.bio}
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => playAudio(activeSpeaker.audio)}
                      className="px-5 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:scale-105 transition"
                    >
                      ▶ Play Voice
                    </button>

                    <button
                      onClick={() => audioRef.current?.pause()}
                      className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                    >
                      ⏸ Pause
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveSpeaker(null)}
                className="absolute top-5 right-6 text-2xl hover:text-yellow-400"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}