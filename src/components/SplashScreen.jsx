import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldCheck, Zap } from 'lucide-react';
import { sfx } from '../lib/sfx';

export default function SplashScreen({ onFinish }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const bootSteps = [
      "INITIALIZING KYYDEVV CYBER CORE...",
      "LOADING GIT DATA API V2.5 MODULES...",
      "AUTHENTICATING LOCAL STORAGE PAT...",
      "PREPARING MULTI-CLOUD DEPLOY ENGINE...",
      "SYSTEM READY. LAUNCHING DASHBOARD..."
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < bootSteps.length) {
        setLogs((prev) => [...prev, bootSteps[current]]);
        sfx.playTyping();
        current++;
        setProgress(Math.round((current / bootSteps.length) * 100));
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onFinish();
        }, 600);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050711] text-slate-100 p-6 font-mono"
      >
        {/* Glow backdrop */}
        <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Custom KyyDevv Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 text-center flex flex-col items-center"
        >
          <div className="relative group cursor-pointer" onClick={() => onFinish()}>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 rounded-3xl blur-xl opacity-75 animate-pulse-glow" />
            <img 
              src="/assets/kyydevv-logo.png" 
              alt="KyyDevv Logo" 
              className="relative w-36 h-36 md:w-44 h-44 object-contain rounded-2xl drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]"
            />
          </div>

          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-sans">
            KyyDevv
          </h1>
          <p className="text-xs text-cyan-400 tracking-widest font-mono uppercase mt-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" /> ZIP2REPO & MULTI-CLOUD DEPLOYER
          </p>
        </motion.div>

        {/* Boot Terminal Box */}
        <div className="w-full max-w-lg bg-slate-900/90 border border-purple-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-12 animate-scanline pointer-events-none" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Terminal className="w-3.5 h-3.5" /> boot_sequence.sh
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> v2.5 SECURE
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300 min-h-[120px]">
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-cyan-500">❯</span>
                <span className={index === logs.length - 1 ? "text-purple-300 font-bold" : "text-slate-400"}>
                  {log}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>SYSTEM LOADING</span>
              <span className="text-cyan-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={onFinish}
          className="mt-6 text-xs text-slate-400 hover:text-cyan-400 underline transition-colors cursor-pointer"
        >
          [ Skip Loading ]
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
