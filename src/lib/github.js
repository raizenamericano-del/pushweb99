import JSZip from "jszip";

const GH_API = "https://api.github.com";

/* ---------- Helper GitHub Fetch ---------- */
export async function gh(token, path, options = {}) {
  const res = await fetch(`${GH_API}${path}`, {
    ...options,
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j.message || "";
    } catch {}
    const err = new Error(friendlyError(res.status, detail));
    err.status = res.status;
    err.detail = detail;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export function friendlyError(status, detail = "") {
  const d = (detail || "").toLowerCase();
  if (status === 401) return "Token GitHub Personal Access Token (PAT) tidak valid atau kedaluwarsa. Silakan perbarui di Settings.";
  if (status === 403) {
    if (d.includes("rate limit")) return "Rate limit GitHub tercapai. Silakan tunggu beberapa menit lalu coba lagi.";
    return "Akses ditolak oleh GitHub. Pastikan token Anda memiliki izin (permission) 'repo'.";
  }
  if (status === 404) return "Resource / Repository tidak ditemukan di GitHub. Periksa kembali nama repo dan hak akses token Anda.";
  if (status === 409) return "Konflik pada repository (mungkin repo baru sedang inisialisasi). Mencoba kembali...";
  if (status === 422) {
    if (d.includes("already exists")) return `Repository dengan nama tersebut sudah ada di akun Anda!`;
    return detail || "Data tidak valid ditolak oleh GitHub (Error 422).";
  }
  return detail ? `GitHub API Error ${status}: ${detail}` : `GitHub API Error ${status}.`;
}

/* ---------- Browser ZIP Extraction ---------- */
export async function extractZip(file, onProgress, onLog) {
  // Check 50MB limit
  const MAX_SIZE_MB = 50;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Ukuran file ZIP (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimal ${MAX_SIZE_MB}MB.`);
  }

  onLog?.('INFO', `Membuka file ZIP: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`);

  let zip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch (e) {
    throw new Error("File ZIP rusak, corrupt, atau format kompresi tidak didukung.");
  }

  const rawEntries = Object.values(zip.files).filter((f) => !f.dir);
  if (rawEntries.length === 0) {
    throw new Error("File ZIP kosong — tidak ditemukan file di dalamnya.");
  }

  onLog?.('INFO', `Ditemukan total ${rawEntries.length} entri di dalam ZIP.`);

  // Detect single wrapping root folder
  const paths = rawEntries.map((f) => f.name.replace(/\\/g, "/"));
  let prefix = "";
  const firstSeg = paths[0].split("/")[0];
  if (paths.length > 1 && paths.every((p) => p.startsWith(firstSeg + "/"))) {
    prefix = firstSeg + "/";
    onLog?.('INFO', `Menghapus wrapper root folder otomatis: "${firstSeg}/"`);
  }

  const skipRegex = /(^|\/)(__MACOSX|\.git|\.DS_Store|Thumbs\.db)(\/|$)/i;

  const files = [];
  let done = 0;

  for (const entry of rawEntries) {
    const cleanPath = entry.name.replace(/\\/g, "/").slice(prefix.length);
    if (!cleanPath || skipRegex.test(entry.name)) {
      done++;
      continue;
    }

    const base64 = await entry.async("base64");
    files.push({
      path: cleanPath,
      contentBase64: base64,
      size: (entry._data && entry._data.uncompressedSize) || 0,
    });

    done++;
    const pct = Math.round((done / rawEntries.length) * 100);
    onProgress?.(pct, cleanPath);
    onLog?.('UNZIP', `[${done}/${rawEntries.length}] Unzipped: ${cleanPath}`);
  }

  if (files.length === 0) {
    throw new Error("Tidak ada file valid di dalam ZIP (hanya berisi file sistem/junk).");
  }

  onLog?.('SUCCESS', `Ekstraksi selesai! ${files.length} file siap diproses.`);
  return files;
}

/* ---------- Sleep Retry Backoff ---------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, { tries = 5, baseDelay = 1000, retryOn = [404, 409] } = {}, onLog) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (!retryOn.includes(e.status) || i === tries - 1) throw e;
      onLog?.('WARN', `Menunggu repository siap... Percobaan ${i + 1}/${tries} (${e.message})`);
      await sleep(baseDelay * (i + 1));
    }
  }
  throw lastErr;
}

/* ---------- Push Files via Git Data API ---------- */
export async function pushFiles({ token, owner, repo, files, branch = "main", onProgress, onStatus, onLog }) {
  // Auto README.md if missing
  const hasReadme = files.some((f) => f.path.toLowerCase() === "readme.md");
  if (!hasReadme) {
    onLog?.('INFO', `README.md tidak ditemukan. Membuat README.md otomatis...`);
    const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const readmeContent = `# ${repo}

![KyyDevv Banner](https://raw.githubusercontent.com/raizenamericano-del/githubpushh/main/public/assets/kyydevv-logo.png)

> **Uploaded & Managed with [KyyDevv Zip2Repo](https://github.com)** ⚡  
> Diunggah pada **${dateStr}** · Total **${files.length + 1} file**

---

### 🚀 Deploy One-Click Options

- [![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/${owner}/${repo})
- [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/${owner}/${repo})
- [![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/${owner}/${repo})

---
*Powered by KyyDevv Cyber Engine v2.5*
`;
    const base64Content = btoa(unescape(encodeURIComponent(readmeContent)));
    files = [...files, { path: "README.md", contentBase64: base64Content, size: readmeContent.length }];
  }

  // 0. Get branch reference SHA
  onStatus?.("Menghubungkan ke GitHub Git Data API...");
  onLog?.('INFO', `Mengambil reference branch '${branch}'...`);

  let ref;
  try {
    ref = await withRetry(
      () => gh(token, `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`),
      { tries: 6, baseDelay: 1200 },
      onLog
    );
  } catch (err) {
    // If branch doesn't exist yet, fetch default branch or root ref
    onLog?.('WARN', `Branch '${branch}' belum ditemukan. Memeriksa repository info...`);
    const repoInfo = await gh(token, `/repos/${owner}/${repo}`);
    const defaultBranch = repoInfo.default_branch || 'main';
    ref = await withRetry(
      () => gh(token, `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(defaultBranch)}`),
      { tries: 5, baseDelay: 1000 },
      onLog
    );
  }

  const baseCommitSha = ref.object.sha;
  onLog?.('SUCCESS', `Base commit SHA ditemukan: ${baseCommitSha.substring(0, 7)}`);

  // 1. Create Blobs concurrently
  onStatus?.(`Mengunggah ${files.length} file ke GitHub (Blobs)...`);
  onLog?.('INFO', `Memulai pembuatan blobs (${files.length} file)...`);

  const blobs = new Array(files.length);
  let completed = 0;
  const CONCURRENCY = 6;
  let idx = 0;

  async function worker() {
    while (idx < files.length) {
      const i = idx++;
      const f = files[i];
      
      const blob = await withRetry(
        () => gh(token, `/repos/${owner}/${repo}/git/blobs`, {
          method: "POST",
          body: JSON.stringify({ content: f.contentBase64, encoding: "base64" }),
        }),
        { tries: 3, baseDelay: 800 },
        onLog
      );

      blobs[i] = { path: f.path, mode: "100644", type: "blob", sha: blob.sha };
      completed++;

      const pct = Math.round((completed / files.length) * 100);
      onProgress?.(pct, f.path);
      onLog?.('PUSH', `[${completed}/${files.length}] Blob created: ${f.path}`);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));
  onLog?.('SUCCESS', `Semua ${files.length} blob berhasil diunggah.`);

  // 2. Create Tree
  onStatus?.("Menyusun Git Tree...");
  onLog?.('INFO', `Membuat Git Tree dengan ${blobs.length} file...`);

  const tree = await withRetry(
    () => gh(token, `/repos/${owner}/${repo}/git/trees`, {
      method: "POST",
      body: JSON.stringify({ tree: blobs }),
    }),
    { tries: 3, baseDelay: 1000 },
    onLog
  );
  onLog?.('SUCCESS', `Git Tree SHA: ${tree.sha.substring(0, 7)}`);

  // 3. Create Commit
  onStatus?.("Membuat Git Commit...");
  onLog?.('INFO', `Membuat commit "🚀 Upload via KyyDevv Zip2Repo"...`);

  const commit = await withRetry(
    () => gh(token, `/repos/${owner}/${repo}/git/commits`, {
      method: "POST",
      body: JSON.stringify({
        message: "🚀 Upload & Deploy via KyyDevv Zip2Repo v2.5",
        tree: tree.sha,
        parents: [baseCommitSha],
      }),
    }),
    { tries: 3, baseDelay: 1000 },
    onLog
  );
  onLog?.('SUCCESS', `Commit dibuat: ${commit.sha.substring(0, 7)}`);

  // 4. Update Branch Head Ref
  onStatus?.(`Memperbarui branch '${branch}'...`);
  onLog?.('INFO', `Mengarahkan refs/heads/${branch} ke commit ${commit.sha.substring(0, 7)}...`);

  await withRetry(
    () => gh(token, `/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: commit.sha, force: true }),
    }),
    { tries: 3, baseDelay: 1000 },
    onLog
  );

  onLog?.('SUCCESS', `✨ PUSH SUCCESSFUL! Repository ${owner}/${repo} berhasil diperbarui.`);
  
  return {
    commitSha: commit.sha,
    fileCount: files.length,
    repoUrl: `https://github.com/${owner}/${repo}`,
    owner,
    repo
  };
}
