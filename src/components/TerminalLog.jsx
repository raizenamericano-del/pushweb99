import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { sfx } from '../lib/sfx';

export default function TerminalLog({ logs, statusText, progress, isBuilding }) {
  const logEndRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const copyLogs = () => {
    const text = logs.map(l => `[${l.time}] [${l.type}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    sfx.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'SUCCESS':
        return 'text-emerald-400 font-bold';
      case 'WARN':
        return 'text-amber-400 font-semibold';
      case 'ERROR':
        return 'text-red-400 font-bold';
      case 'UNZIP':
        return 'text-cyan-300';
      case 'PUSH':
        return 'text-purple-300';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="w-full my-6 rounded-2xl bg-[#090d1a] border border-purple-500/30 shadow-2xl overflow-hidden font-mono text-xs relative">
      {/* Retro Scanline Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-16 animate-scanline pointer-events-none z-10" />

      {/* Terminal Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 z-20 relative">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="ml-2 text-slate-400 font-semibold text-[11px] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-purple-400" /> KyyDevv Build Engine v2.5
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isBuilding && (
            <span className="flex items-center gap-1.5 text-cyan-400 text-[11px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>LOGGING...</span>
            </span>
          )}
          <button
            onClick={copyLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Copy Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800/80">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-cyan-300 font-semibold flex items-center gap-2">
            {isBuilding && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
            <span>{statusText || "Engine idle..."}</span>
          </span>
          <span className="font-bold font-mono text-purple-400">{progress}%</span>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden p-0.5 border border-purple-500/20">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Log Output Area */}
      <div className="p-4 h-64 overflow-y-auto space-y-1.5 selection:bg-purple-600 selection:text-white relative z-20">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic">Waiting for deployment activity...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2 leading-relaxed">
              <span className="text-cyan-600 select-none">[{log.time}]</span>
              <span className="text-purple-400/80 select-none">[{log.type}]</span>
              <span className={getTypeStyle(log.type)}>{log.message}</span>
            </div>
          ))
        )}
        
        {/* Blinking Cursor */}
        {isBuilding && (
          <div className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle" />
        )}

        <div ref={logEndRef} />
      </div>
    </div>
  );
}
