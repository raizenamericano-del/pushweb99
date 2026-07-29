import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X, ShieldAlert, Loader2 } from 'lucide-react';
import { sfx } from '../lib/sfx';

export default function DeleteRepoModal({ isOpen, onClose, token, user, onDeleteSuccess }) {
  const [repoName, setRepoName] = useState('');
  const [confirmName, setConfirmName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!repoName.trim()) {
      setErrorMsg('Harap masukkan nama repository.');
      sfx.playError();
      return;
    }

    if (confirmName.trim().toLowerCase() !== repoName.trim().toLowerCase()) {
      setErrorMsg('Nama konfirmasi tidak cocok dengan nama repository!');
      sfx.playError();
      return;
    }

    setLoading(true);
    setErrorMsg('');
    sfx.playClick();

    try {
      const res = await fetch('/api/delete-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          owner: user.login,
          repo: repoName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus repository.');
      }

      sfx.playSuccess();
      onDeleteSuccess(repoName.trim());
      onClose();
      setRepoName('');
      setConfirmName('');
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menghapus repository.');
      sfx.playError();
    } finally {
      setLoading(false);
    }
  };

  const isConfirmed = repoName.trim().length > 0 && confirmName.trim().toLowerCase() === repoName.trim().toLowerCase();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-red-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden"
        >
          {/* Header warning bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse" />

          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white font-sans">
                Hapus Repository GitHub
              </h3>
              <p className="text-xs text-red-300 font-mono mt-0.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Aksi ini bersifat PERMANEN dan tidak dapat dibatalkan!
              </p>
            </div>
          </div>

          <form onSubmit={handleDelete} className="space-y-4 my-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                1. Nama Repository yang akan dihapus:
              </label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="misal: project-lama"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                2. Ketik ulang nama repository di atas untuk konfirmasi:
              </label>
              <input
                type="text"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder="Ketik persis nama repo..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-red-500/40 text-red-200 text-sm font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={!isConfirmed || loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>HAPUS REPOSITORY</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
