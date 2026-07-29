import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle2, Shield, Key, Copy, Check, X } from 'lucide-react';
import { sfx } from '../lib/sfx';

export default function TokenGuideModal({ isOpen, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText("https://github.com/settings/tokens");
    setCopied(true);
    sfx.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Top header glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

          {/* Close button */}
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-300">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100 font-sans">
                Cara Membuat GitHub Personal Access Token (PAT)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Panduan resmi KyyDevv agar aplikasi bisa membuat & mendorong kode ke repo Anda.
              </p>
            </div>
          </div>

          <div className="space-y-4 my-6 text-sm text-slate-300">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                1
              </span>
              <div className="flex-1">
                <p className="font-semibold text-slate-200">Buka Halaman Developer Settings GitHub</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik link di bawah ini untuk membuka halaman pembuatan token (classic):
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors"
                  >
                    <span>Buka github.com/settings/tokens</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={copyUrl}
                    className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy URL"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-200">Generate New Token (Classic)</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik tombol <strong>"Generate new token"</strong> lalu pilih <strong>"Generate new token (classic)"</strong>. Beri nama bebas (misal: <code className="text-cyan-300">KyyDevv App</code>).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                3
              </span>
              <div className="space-y-1.5 w-full">
                <p className="font-semibold text-slate-200">Centang Scope Permissions yang Diperlukan:</p>
                <ul className="text-xs text-slate-300 space-y-1 pl-1">
                  <li className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span><strong>repo</strong> (Full control of private repositories) — WAJIB</span>
                  </li>
                  <li className="flex items-center gap-2 text-purple-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span><strong>delete_repo</strong> (Opsional: Jika ingin fitur hapus repo)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                4
              </span>
              <div>
                <p className="font-semibold text-slate-200">Generate & Copy Token</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik <strong>"Generate token"</strong> di bagian paling bawah. Copy token yang diawali dengan <code className="text-cyan-300">ghp_...</code> dan tempelkan di form input aplikasi.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg transition-all cursor-pointer"
            >
              Saya Paham, Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
