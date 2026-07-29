import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to call GitHub API safely
async function githubFetch(path, token, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'KyyDevv-Zip2Repo-App',
    },
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`https://api.github.com${path}`, options);
  
  if (res.status === 204) return { success: true };

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `GitHub error ${res.status}`);
    error.status = res.status;
    error.detail = data;
    throw error;
  }
  return data;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', branding: 'KyyDevv', timestamp: new Date().toISOString() });
});

// Validate GitHub PAT
app.post('/api/validate-token', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token GitHub (PAT) wajib diisi.' });
    }

    const userData = await githubFetch('/user', token);
    res.json({
      success: true,
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        public_repos: userData.public_repos,
        followers: userData.followers,
        bio: userData.bio,
      },
    });
  } catch (err) {
    console.error('Validate Token Error:', err.message);
    const status = err.status || 500;
    let message = 'Token tidak valid atau terjadi kesalahan.';
    if (status === 401) message = 'Token GitHub Personal Access Token (PAT) tidak valid / expired.';
    if (status === 403) message = 'Akses ditolak atau Rate Limit GitHub tercapai.';
    res.status(status).json({ error: message, detail: err.message });
  }
});

// Create new Repository
app.post('/api/create-repo', async (req, res) => {
  try {
    const { token, name, isPrivate, description } = req.body;
    if (!token || !name) {
      return res.status(400).json({ error: 'Token dan nama repository wajib diisi.' });
    }

    const cleanName = name.trim().replace(/\s+/g, '-');

    const repoData = await githubFetch('/user/repos', token, 'POST', {
      name: cleanName,
      description: description || `Created via KyyDevv Zip2Repo on ${new Date().toLocaleDateString('id-ID')}`,
      private: Boolean(isPrivate),
      auto_init: true, // Creates default branch with initial commit
    });

    res.json({
      success: true,
      repo: {
        name: repoData.name,
        full_name: repoData.full_name,
        owner: repoData.owner.login,
        html_url: repoData.html_url,
        clone_url: repoData.clone_url,
        private: repoData.private,
        default_branch: repoData.default_branch || 'main',
      },
    });
  } catch (err) {
    console.error('Create Repo Error:', err.message);
    const status = err.status || 500;
    let message = 'Gagal membuat repository.';
    if (status === 422) message = `Repository dengan nama '${req.body.name}' sudah ada di akun GitHub Anda!`;
    if (status === 401) message = 'Token GitHub tidak valid.';
    res.status(status).json({ error: message, detail: err.message });
  }
});

// Check Existing Repo
app.post('/api/check-repo', async (req, res) => {
  try {
    const { token, owner, repo } = req.body;
    if (!token || !owner || !repo) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    const repoData = await githubFetch(`/repos/${owner}/${repo}`, token);
    res.json({
      success: true,
      repo: {
        name: repoData.name,
        full_name: repoData.full_name,
        owner: repoData.owner.login,
        html_url: repoData.html_url,
        default_branch: repoData.default_branch || 'main',
      },
    });
  } catch (err) {
    const status = err.status || 500;
    let message = `Repository '${req.body.owner}/${req.body.repo}' tidak ditemukan.`;
    if (status === 404) message = `Repository '${req.body.owner}/${req.body.repo}' tidak ditemukan atau tidak memiliki akses.`;
    res.status(status).json({ error: message });
  }
});

// Delete Repository
app.post('/api/delete-repo', async (req, res) => {
  try {
    const { token, owner, repo } = req.body;
    if (!token || !owner || !repo) {
      return res.status(400).json({ error: 'Token, owner, dan nama repository wajib diisi.' });
    }

    await githubFetch(`/repos/${owner}/${repo}`, token, 'DELETE');
    res.json({ success: true, message: `Repository ${owner}/${repo} berhasil dihapus.` });
  } catch (err) {
    console.error('Delete Repo Error:', err.message);
    const status = err.status || 500;
    let message = 'Gagal menghapus repository.';
    if (status === 404) message = 'Repository tidak ditemukan atau Anda tidak punya hak akses.';
    if (status === 403) message = 'Token Anda kekurangan scope `delete_repo`. Pastikan token diberi izin hapus repo.';
    res.status(status).json({ error: message, detail: err.message });
  }
});

// Serve static React build in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`⚡ KyyDevv Zip2Repo Server running on port ${PORT}`);
});
