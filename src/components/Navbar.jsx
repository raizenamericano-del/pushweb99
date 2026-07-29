import React from 'react';
import { Settings, Volume2, VolumeX, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { sfx } from '../lib/sfx';

export default function Navbar({ user, hasToken, onOpenSettings, soundEnabled, onToggleSound }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070913]/80 border-b border-purple-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            sfx.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition duration-300" />
            <img 
              src="/assets/kyydevv-logo.png" 
              alt="KyyDevv Logo" 
              className="relative w-10 h-10 object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent font-sans">
                KyyDevv
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-purple-950/80 border border-purple-500/40 text-cyan-300 rounded">
                v2.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              Zip2Repo & Multi-Cloud Deployer
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound Toggle */}
          <button
            onClick={() => {
              sfx.playClick();
              onToggleSound();
            }}
            title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-purple-500/40 transition-all cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Token Status Badge */}
          {hasToken ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>PAT Connected</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>No Token</span>
            </div>
          )}

          {/* User Profile Pill (If authenticated) */}
          {user && (
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs">
              <img 
                src={user.avatar_url} 
                alt={user.login} 
                className="w-6 h-6 rounded-full border border-purple-400/50" 
              />
              <span className="font-semibold text-slate-200 hidden md:inline">
                @{user.login}
              </span>
            </div>
          )}

          {/* Settings Drawer Button */}
          <button
            onClick={() => {
              sfx.playClick();
              onOpenSettings();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-purple-600/25 border border-purple-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

        </div>
      </div>
    </header>
  );
}
