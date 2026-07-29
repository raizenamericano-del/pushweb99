import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, Sparkles, HelpCircle, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sfx } from '../lib/sfx';

export default function TokenGate({ onTokenSave, onOpenGuide }) {
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setErrorMsg('Harap masukkan Personal Access Token (PAT) GitHub.');
      sfx.playError();
      return;
    }

    setLoading(true);
    setErrorMsg('');
    sfx.playClick();

    try {
      const res = await fetch('/api/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Token tidak valid. Silakan periksa kembali.');
      }

      sfx.playSuccess();
      onTokenSave(tokenInput.trim(), data.user);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memvalidasi token.');
      sfx.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(139,92,246,0.15)]"
      >
        {/* Animated accent glow background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-600/20 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/30">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 font-sans tracking-wide">
              GitHub Access Token
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Masukkan Token GitHub sekali saja. Tersimpan aman di localStorage browser Anda.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider mb-2">
              GitHub Personal Access Token (PAT)
            </label>

            <div className="relative flex items-center">
              <input
                type={showToken ? 'text' : 'password'}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-4 pr-24 py-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 text-slate-100 placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />

              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showToken ? "Sembunyikan" : "Tampilkan"}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                sfx.playClick();
                onOpenGuide();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-cyan-400 text-xs font-semibold border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Cara Buat Token GitHub</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validasi Token...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simpan & Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security badge note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Token Anda disimpan secara lokal di browser dan tidak pernah dikirim ke server pihak ketiga manapun.
          </span>
        </div>
      </motion.div>
    </div>
  );
}
