import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen';
import CursorGlow from './components/CursorGlow';
import BackgroundFX from './components/BackgroundFX';
import TokenGate from './components/TokenGate';
import TokenGuideModal from './components/TokenGuideModal';
import SettingsPanel from './components/SettingsPanel';
import UploadForm from './components/UploadForm';
import TerminalLog from './components/TerminalLog';
import DeleteRepoModal from './components/DeleteRepoModal';
import RocketAnimation from './components/RocketAnimation';
import SuccessScreen from './components/SuccessScreen';
import Footer from './components/Footer';
import TiltCard from './components/TiltCard';

import { storage } from './lib/storage';
import { history } from './lib/history';
import { sfx } from './lib/sfx';
import { extractZip, pushFiles } from './lib/github';
import { Zap, ShieldCheck, Sparkles, FolderGit2, ArrowRight } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [token, setToken] = useState(() => storage.getToken());
  const [user, setUser] = useState(() => storage.getUser());
  
  // App Settings
  const [soundEnabled, setSoundEnabled] = useState(() => storage.getSettings().soundEnabled);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form State
  const [mode, setMode] = useState('create'); // 'create' | 'existing'
  const [repoName, setRepoName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [description, setDescription] = useState('');
  const [zipFile, setZipFile] = useState(null);

  // Build & Terminal State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [logs, setLogs] = useState([]);

  // Success & Animation State
  const [rocketActive, setRocketActive] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [historyList, setHistoryList] = useState(() => history.getAll());

  // Validate Token on launch if present
  useEffect(() => {
    sfx.setEnabled(soundEnabled);
    if (token && !user) {
      fetch('/api/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);
            storage.setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sfx.setEnabled(next);
    storage.saveSettings({ soundEnabled: next });
  };

  const handleTokenSave = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    storage.setToken(newToken);
    storage.setUser(userData);
  };

  const handleTokenDelete = () => {
    setToken('');
    setUser(null);
    storage.removeToken();
    setSettingsOpen(false);
    sfx.playClick();
  };

  const addLog = (type, message) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
    setLogs((prev) => [...prev, { time, type, message }]);
  };

  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    if (!token || !user) {
      setGuideOpen(true);
      return;
    }
    if (!repoName.trim() || !zipFile) return;

    setIsProcessing(true);
    setLogs([]);
    setProgress(0);
    setStatusText('Memulai proses ekstraksi & upload...');
    setSuccessResult(null);

    const cleanRepo = repoName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

    try {
      // Step 1: Extract Zip File in browser
      addLog('INFO', '=== LANGKAH 1: EKSTRAKSI ZIP DI BROWSER ===');
      const files = await extractZip(
        zipFile,
        (pct, path) => setProgress(Math.round(pct * 0.3)), // 0-30%
        addLog
      );

      // Step 2: Handle Repo Creation / Checking
      addLog('INFO', `=== LANGKAH 2: INISIALISASI REPOSITORY (${mode.toUpperCase()}) ===`);
      if (mode === 'create') {
        setStatusText(`Membuat repository '${cleanRepo}' di GitHub...`);
        addLog('INFO', `Membuat repository baru '${user.login}/${cleanRepo}' (Private: ${isPrivate})...`);

        const createRes = await fetch('/api/create-repo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            name: cleanRepo,
            isPrivate,
            description: description || `Uploaded via KyyDevv Zip2Repo`,
          }),
        });

        const createData = await createRes.json();
        if (!createRes.ok) {
          throw new Error(createData.error || 'Gagal membuat repository baru.');
        }

        addLog('SUCCESS', `Repository '${user.login}/${cleanRepo}' berhasil dibuat!`);
      } else {
        setStatusText(`Memeriksa akses ke repository '${cleanRepo}'...`);
        addLog('INFO', `Memeriksa apakah repo '${user.login}/${cleanRepo}' tersedia...`);

        const checkRes = await fetch('/api/check-repo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            owner: user.login,
            repo: cleanRepo,
          }),
        });

        const checkData = await checkRes.json();
        if (!checkRes.ok) {
          throw new Error(checkData.error || `Repository '${cleanRepo}' tidak ditemukan di akun Anda.`);
        }

        addLog('SUCCESS', `Repository '${user.login}/${cleanRepo}' ditemukan & siap dipush.`);
      }

      // Step 3: Push Files via Git Data API
      addLog('INFO', '=== LANGKAH 3: PUSH FILE KE GITHUB GIT DATA API ===');
      setStatusText('Mengunggah file ke Git Data API...');

      const result = await pushFiles({
        token,
        owner: user.login,
        repo: cleanRepo,
        files,
        branch: 'main',
        onProgress: (pct, path) => {
          setProgress(30 + Math.round(pct * 0.7)); // 30-100%
        },
        onStatus: (status) => setStatusText(status),
        onLog: addLog,
      });

      // Step 4: Save History
      const histItem = {
        owner: user.login,
        repo: cleanRepo,
        repoUrl: result.repoUrl,
        fileCount: result.fileCount,
        commitSha: result.commitSha,
      };
      const updatedHist = history.add(histItem);
      setHistoryList(updatedHist);

      // Step 5: Launch Victory Rocket & Confetti
      setStatusText('Push Selesai! Meluncurkan roket...');
      sfx.playRocket();
      setRocketActive(true);
      setSuccessResult(result);

    } catch (err) {
      addLog('ERROR', `[GAGAL] ${err.message}`);
      setStatusText(`Proses Gagal: ${err.message}`);
      sfx.playError();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col justify-between relative">
      
      {/* Background Visual FX */}
      <BackgroundFX />
      <CursorGlow />

      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Main Content Area */}
      <div>
        {/* Navbar */}
        <Navbar
          user={user}
          hasToken={Boolean(token)}
          onOpenSettings={() => setSettingsOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-cyan-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span>KyyDevv Cyber Engine v2.5 · Railway Ready</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans leading-tight">
                Upload <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">ZIP</span> Direct to <span className="text-purple-400">GitHub</span> & Cloud
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Ekstrak file `.zip` langsung di browser, push ke repository GitHub via Git Data API, lalu sebar ke Vercel, Netlify, & Railway dalam 1-Click!
              </p>

              {/* Quick Feature Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs font-mono text-slate-400">
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Token Safe in LocalStorage
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> JSZip Browser Unpack
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-purple-400" /> Auto README Generator
                </span>
              </div>
            </div>

            {/* Right Anime Dev Banner Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <TiltCard className="p-2 border-purple-500/30 max-w-md w-full shadow-[0_0_50px_rgba(139,92,246,0.25)]">
                <img
                  src="/assets/anime-dev.png"
                  alt="KyyDevv Cyber Developer"
                  className="w-full h-auto rounded-xl object-cover"
                />
              </TiltCard>
            </div>

          </div>

          {/* Conditional Workflow: Token Gate vs Main Upload Workspace */}
          {!token ? (
            <TokenGate
              onTokenSave={handleTokenSave}
              onOpenGuide={() => setGuideOpen(true)}
            />
          ) : (
            <>
              {/* Success Screen OR Upload Form */}
              {successResult ? (
                <SuccessScreen
                  result={successResult}
                  user={user}
                  onReset={() => {
                    setSuccessResult(null);
                    setRepoName('');
                    setZipFile(null);
                  }}
                />
              ) : (
                <UploadForm
                  user={user}
                  mode={mode}
                  setMode={setMode}
                  repoName={repoName}
                  setRepoName={setRepoName}
                  isPrivate={isPrivate}
                  setIsPrivate={setIsPrivate}
                  description={description}
                  setDescription={setDescription}
                  zipFile={zipFile}
                  setZipFile={setZipFile}
                  onSubmit={handleProcessSubmit}
                  isProcessing={isProcessing}
                  onOpenGuide={() => setGuideOpen(true)}
                  onOpenDeleteModal={() => setDeleteModalOpen(true)}
                />
              )}

              {/* Terminal Log Console */}
              {(isProcessing || logs.length > 0) && (
                <div className="max-w-4xl mx-auto px-4">
                  <TerminalLog
                    logs={logs}
                    statusText={statusText}
                    progress={progress}
                    isBuilding={isProcessing}
                  />
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* Modals & Drawers */}
      <TokenGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        hasToken={Boolean(token)}
        user={user}
        onUpdateToken={handleTokenSave}
        onDeleteToken={handleTokenDelete}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        historyList={historyList}
        onOpenGuide={() => setGuideOpen(true)}
      />

      <DeleteRepoModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        token={token}
        user={user}
        onDeleteSuccess={(deletedRepo) => {
          setLogs([]);
          addLog('SUCCESS', `Repository '${deletedRepo}' berhasil dihapus dari akun GitHub Anda!`);
        }}
      />

      <RocketAnimation
        active={rocketActive}
        onComplete={() => setRocketActive(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
