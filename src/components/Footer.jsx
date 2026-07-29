import React from 'react';
import { ShieldCheck, Heart, Github, Code, Sparkles, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-purple-500/20 bg-[#050711]/90 backdrop-blur-xl py-8 px-4 mt-16 text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/kyydevv-logo.png"
            alt="KyyDevv Logo"
            className="w-8 h-8 object-contain rounded-lg drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-200 font-sans tracking-wide">
                KyyDevv
              </span>
              <span className="text-[10px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                Zip2Repo v2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Browser ZIP Extractor & Multi-Cloud One-Click Deployer
            </p>
          </div>
        </div>

        {/* Center Live Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-300">Railway Ready Server</span>
          <span className="text-slate-600">|</span>
          <span className="text-purple-400 font-bold">100% Client Extraction</span>
        </div>

        {/* Right Signature */}
        <div className="text-center md:text-right">
          <p className="text-slate-400">
            Powered by <strong className="text-cyan-400">Git Data API</strong> & <strong className="text-purple-400">JSZip</strong>
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">
            © {new Date().getFullYear()} KyyDevv. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
