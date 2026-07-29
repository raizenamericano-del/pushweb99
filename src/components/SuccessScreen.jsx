import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, GitCommit, FileCheck, ExternalLink, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import DeployButtons from './DeployButtons';
import ConfettiTrigger from './ConfettiFX';
import { sfx } from '../lib/sfx';

export default function SuccessScreen({ result, user, onReset }) {
  useEffect(() => {
    sfx.playSuccess();
  }, []);

  if (!result) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      {/* Confetti celebration */}
      <ConfettiTrigger active={true} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl bg-slate-900/90 border border-purple-500/40 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_80px_rgba(139,92,246,0.25)] relative overflow-hidden"
      >
        {/* Glowing background highlights */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/20 via-purple-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Victory Badge */}
        <div className="text-center relative z-10 mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-600 text-white shadow-[0_0_40px_rgba(16,185,129,0.5)] mb-4"
          >
            <Trophy className="w-12 h-12" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-300 bg-clip-text text-transparent font-sans">
            DEPLOYS & PUSH BERHASIL! 🚀
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-mono mt-2">
            Semua file telah diekstrak, dibuatkan blob, dan di-commit ke branch <code className="text-cyan-300 font-bold">main</code> di GitHub!
          </p>
        </div>

        {/* Deployment Metadata Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20 mb-8 text-xs font-mono">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            {user?.avatar_url && (
              <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full border border-purple-400" />
            )}
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Owner</span>
              <span className="text-slate-200 font-bold">@{result.owner}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Total File</span>
              <span className="text-cyan-300 font-bold">{result.fileCount} Files Uploaded</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-500/30">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Commit SHA</span>
              <span className="text-purple-300 font-bold">{result.commitSha?.substring(0, 7) || 'HEAD'}</span>
            </div>
          </div>
        </div>

        {/* Deploy Buttons Grid */}
        <DeployButtons repoUrl={result.repoUrl} owner={result.owner} repo={result.repo} />

        {/* Reset Action */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center">
          <button
            onClick={() => {
              sfx.playClick();
              onReset();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 hover:border-purple-500/40 transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Upload File ZIP Lainnya</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
