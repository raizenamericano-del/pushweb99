import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Trash2, Volume2, VolumeX, ShieldCheck, ExternalLink, HelpCircle, History, Sparkles, UserCheck, RefreshCw } from 'lucide-react';
import { sfx } from '../lib/sfx';

export default function SettingsPanel({
  isOpen,
  onClose,
  hasToken,
  user,
  onUpdateToken,
  onDeleteToken,
  soundEnabled,
  onToggleSound,
  historyList,
  onOpenGuide
}) {
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [newToken, setNewToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSaveToken = async (e) => {
    e.preventDefault();
    if (!newToken.trim()) return;

    setLoading(true);
    setErrorMsg('');
    sfx.playClick();

    try {
      const res = await fetch('/api/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: newToken.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Token tidak valid.');

      sfx.playSuccess();
      onUpdateToken(newToken.trim(), data.user);
      setShowTokenInput(false);
      setNewToken('');
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengubah token.');
      sfx.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            sfx.playClick();
            onClose();
          }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Slide-in Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 w-full max-w-md bg-[#080b18] border-l border-purple-500/30 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-500/30">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 font-sans">
                    Settings & Profile
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    KyyDevv Control Center
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sfx.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GitHub User Profile Card */}
            {user ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-12 h-12 rounded-full border-2 border-purple-500/60 shadow-md"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5 truncate">
                      <span>{user.name}</span>
                      <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    </h4>
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono truncate"
                    >
                      @{user.login} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  <div>
                    <span>Public Repos:</span> <strong className="text-slate-200">{user.public_repos}</strong>
                  </div>
                  <div>
                    <span>Followers:</span> <strong className="text-slate-200">{user.followers}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono mb-6">
                Belum ada GitHub PAT tersimpan di browser.
              </div>
            )}

            {/* PAT Actions Section */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Token Management
              </h4>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Status Token:</span>
                {hasToken ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-mono font-bold">
                    Connected ✓
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/40 font-mono font-bold">
                    Not Set
                  </span>
                )}
              </div>

              {!showTokenInput ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setShowTokenInput(true);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-500/40 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ganti Token</span>
                  </button>

                  <button
                    onClick={() => {
                      sfx.playClick();
                      onDeleteToken();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/40 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Token</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveToken} className="p-3 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2">
                  <input
                    type="password"
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  {errorMsg && <p className="text-[11px] text-red-400">{errorMsg}</p>}
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowTokenInput(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
                    >
                      {loading ? 'Validasi...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              )}

              <button
                onClick={() => {
                  sfx.playClick();
                  onOpenGuide();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Petunjuk Buat Token GitHub</span>
              </button>
            </div>

            {/* Audio Preferences */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Preferences
              </h4>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-300 flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  Sound Effects (SFX)
                </span>
                <button
                  onClick={() => {
                    sfx.playClick();
                    onToggleSound();
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Deployment History List */}
            {historyList && historyList.length > 0 && (
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-purple-400" /> Recent Deployments
                </h4>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {historyList.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-cyan-300 block">
                          {item.repo}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.timestamp).toLocaleDateString('id-ID')} · {item.fileCount} files
                        </span>
                      </div>
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Branding */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 font-mono">
              Crafted with 💜 by <strong className="text-purple-400">KyyDevv</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
