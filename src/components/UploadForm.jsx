import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FolderPlus, GitCommit, Trash2, FileArchive, Lock, Globe, Sparkles, Check, AlertCircle, HelpCircle, FileText } from 'lucide-react';
import { sfx } from '../lib/sfx';

export default function UploadForm({
  user,
  mode,
  setMode,
  repoName,
  setRepoName,
  isPrivate,
  setIsPrivate,
  description,
  setDescription,
  zipFile,
  setZipFile,
  onSubmit,
  isProcessing,
  onOpenGuide,
  onOpenDeleteModal
}) {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setFileError('');
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setFileError('Format file harus berupa .zip!');
      sfx.playError();
      return;
    }

    const maxMB = 50;
    if (file.size > maxMB * 1024 * 1024) {
      setFileError(`Ukuran file (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimal ${maxMB}MB!`);
      sfx.playError();
      return;
    }

    setZipFile(file);
    sfx.playSuccess();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="rounded-3xl bg-slate-900/80 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-glass relative overflow-hidden">
        
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Action Mode Selector Tabs */}
        <div className="flex flex-wrap p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 mb-8">
          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              setMode('create');
            }}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              mode === 'create'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>1. Create New Repo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              setMode('existing');
            }}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              mode === 'existing'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            <span>2. Push Existing Repo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playClick();
              onOpenDeleteModal();
            }}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>3. Delete Repo</span>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Repository Name Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                Nama Repository {mode === 'existing' ? '(Existing)' : ''}
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {user ? `${user.login}/` : ''}{repoName || 'my-awesome-app'}
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                placeholder="nama-repository-baru"
                required
                className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Description (Optional) */}
          {mode === 'create' && (
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                Deskripsi Repository (Opsional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat seputar project Anda..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-sans focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          )}

          {/* Public / Private Selector */}
          {mode === 'create' && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isPrivate ? 'bg-purple-950 text-purple-400 border border-purple-500/40' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'}`}>
                  {isPrivate ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Visibility: {isPrivate ? 'PRIVATE' : 'PUBLIC'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isPrivate ? 'Hanya Anda & kolaborator yang bisa melihat repo ini' : 'Semua orang bisa melihat repo ini di GitHub'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setIsPrivate(!isPrivate);
                }}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                  isPrivate ? 'bg-purple-600' : 'bg-emerald-600'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    isPrivate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Drag & Drop ZIP Area */}
          <div>
            <label className="block text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2">
              Upload File Project (.ZIP) — Max 50MB
            </label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01]'
                  : zipFile
                  ? 'border-emerald-500/60 bg-emerald-950/20'
                  : 'border-purple-500/30 bg-slate-950/60 hover:border-purple-400 hover:bg-slate-950/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                className="hidden"
              />

              {zipFile ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mb-3 animate-bounce">
                    <FileArchive className="w-10 h-10" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-300 font-mono">
                    {zipFile.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Ukuran: {formatFileSize(zipFile.size)}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sfx.playClick();
                      setZipFile(null);
                    }}
                    className="mt-3 text-xs text-red-400 hover:text-red-300 underline transition-colors cursor-pointer"
                  >
                    Ganti File ZIP
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-400 mb-3">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">
                    Tarik & Lepas File .ZIP Di Sini
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    atau <span className="text-cyan-400 font-semibold underline">klik untuk memilih file</span> dari komputer
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-3">
                    Aplikasi akan mengekstrak ZIP di browser secara otomatis
                  </p>
                </div>
              )}
            </div>

            {fileError && (
              <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{fileError}</span>
              </p>
            )}
          </div>

          {/* Action Launch Button */}
          <button
            type="submit"
            disabled={isProcessing || !repoName.trim() || !zipFile}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-extrabold text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-[1.01] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>MEMPROSES & MENDORONG KE GITHUB...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span>
                  {mode === 'create' ? 'BUAT REPO & PUSH FILE 🚀' : 'PUSH KE REPO EXISTING ⚡'}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
