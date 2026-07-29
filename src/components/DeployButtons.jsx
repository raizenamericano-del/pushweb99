import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Rocket, Globe, Zap, Server, Cloud, FolderCheck } from 'lucide-react';
import { sfx } from '../lib/sfx';

export default function DeployButtons({ repoUrl, owner, repo }) {
  const [copied, setCopied] = useState(false);

  const cleanRepoUrl = repoUrl || `https://github.com/${owner}/${repo}`;

  const copyRepoUrl = () => {
    navigator.clipboard.writeText(cleanRepoUrl);
    setCopied(true);
    sfx.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      name: 'Vercel',
      icon: '🚀',
      color: 'from-slate-900 via-zinc-800 to-black hover:border-white/60 text-white',
      glow: 'shadow-[0_0_25px_rgba(255,255,255,0.2)]',
      url: `https://vercel.com/new/git/external?repository-url=${encodeURIComponent(cleanRepoUrl)}`,
      badge: 'Frontend / Fullstack',
      desc: 'Instant serverless deployment with edge CDN'
    },
    {
      name: 'Netlify',
      icon: '🟢',
      color: 'from-teal-950 via-teal-900 to-emerald-950 hover:border-teal-400 text-teal-200',
      glow: 'shadow-[0_0_25px_rgba(20,184,166,0.25)]',
      url: `https://app.netlify.com/start/deploy?repository=${encodeURIComponent(cleanRepoUrl)}`,
      badge: 'Automated CI/CD',
      desc: 'Build & deploy static sites and web apps'
    },
    {
      name: 'Railway',
      icon: '🟣',
      color: 'from-purple-950 via-purple-900 to-indigo-950 hover:border-purple-400 text-purple-200',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.3)]',
      url: `https://railway.app/new/template?template=${encodeURIComponent(cleanRepoUrl)}`,
      badge: 'Node / Docker / Fullstack',
      desc: 'Deploy backend, databases, & fullstack apps'
    },
    {
      name: 'Cloudflare Pages',
      icon: '☁️',
      color: 'from-amber-950 via-orange-950 to-amber-900 hover:border-orange-400 text-orange-200',
      glow: 'shadow-[0_0_25px_rgba(249,115,22,0.25)]',
      url: `https://dash.cloudflare.com/?to=/:account/pages/new/provider/github`,
      badge: 'Edge Hosting',
      desc: 'Blazing fast global edge network'
    },
    {
      name: 'Render',
      icon: '📦',
      color: 'from-cyan-950 via-sky-900 to-blue-950 hover:border-cyan-400 text-cyan-200',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
      url: `https://render.com/deploy?repo=${encodeURIComponent(cleanRepoUrl)}`,
      badge: 'Cloud Hosting',
      desc: 'Web services, static sites, & PostgreSQL'
    }
  ];

  return (
    <div className="w-full my-6">
      
      {/* Top Action Bar (Copy & Open Repo) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 mb-6 shadow-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
          <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300">
            <FolderCheck className="w-5 h-5" />
          </div>
          <div className="truncate">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Repository URL
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300 truncate block">
              {cleanRepoUrl}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={copyRepoUrl}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Copy URL</span>
              </>
            )}
          </button>

          <a
            href={cleanRepoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => sfx.playClick()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Repo</span>
          </a>
        </div>
      </div>

      {/* Title Header */}
      <div className="text-center my-6">
        <h3 className="text-xl font-extrabold text-white font-sans tracking-wide flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400 animate-bounce" />
          <span>One-Click Multi-Cloud Deploy</span>
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Pilih platform cloud tempat Anda ingin menyebarkan web app ini secara langsung
        </p>
      </div>

      {/* One-Click Deploy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((p, i) => (
          <a
            key={i}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => sfx.playHover()}
            onClick={() => sfx.playClick()}
            className={`group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br border border-slate-800 backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer ${p.color} ${p.glow}`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{p.icon}</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-300">
                {p.badge}
              </span>
            </div>

            {/* Title & Desc */}
            <h4 className="text-base font-extrabold tracking-wide mb-1 flex items-center justify-between">
              <span>Deploy to {p.name}</span>
              <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </h4>
            <p className="text-xs opacity-75 leading-relaxed font-sans">
              {p.desc}
            </p>

            {/* Hover shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
        ))}
      </div>
    </div>
  );
}
