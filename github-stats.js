/**
 * VAMSHIDHAR REDDY M — LIVE GITHUB STATS
 * Pulls real-time data from the GitHub API (no auth needed for public data).
 * Caches results in localStorage for 1 hour to respect rate limits.
 */

(function () {
  'use strict';

  const USERNAME = 'mvamshi56';
  const CACHE_KEY = 'github_stats_v1';
  const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

  async function fetchGitHubStats() {
    // Try cache first
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.data;
      }
    } catch (e) { /* ignore parse errors */ }

    // Fetch fresh from GitHub
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`)
    ]);

    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentlyActive = repos.filter(r => new Date(r.pushed_at).getTime() > thirtyDaysAgo).length;

    // Find most recently pushed repo
    let lastCommitRepo = repos[0] || null;
    let lastCommitTime = 0;
    repos.forEach(r => {
      const t = new Date(r.pushed_at).getTime();
      if (t > lastCommitTime) {
        lastCommitTime = t;
        lastCommitRepo = r;
      }
    });

    const data = {
      repos: user.public_repos,
      stars: totalStars,
      recentlyActive,
      lastCommitTime,
      lastCommitRepoName: lastCommitRepo ? lastCommitRepo.name : null
    };

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) { /* localStorage might be unavailable */ }

    return data;
  }

  function relativeTime(timestamp) {
    if (!timestamp) return '—';
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return minutes + 'm ago';
    if (hours < 24) return hours + 'h ago';
    if (days < 30) return days + 'd ago';
    const months = Math.floor(days / 30);
    return months + 'mo ago';
  }

  function injectSkeleton() {
    const impactSection = document.getElementById('impact');
    if (!impactSection) return null;

    const section = document.createElement('section');
    section.className = 'github-stats-section';
    section.id = 'github-stats';
    section.setAttribute('data-animate', 'fade-up');
    section.innerHTML = `
      <div class="container">
        <div class="github-stats-header">
          <span class="github-stats-tag">
            <i class="fab fa-github"></i>
            Live from GitHub
            <span class="live-dot"></span>
          </span>
          <h3 class="github-stats-title">Real-time activity from my repositories</h3>
        </div>
        <div class="github-stats-grid" id="ghStatsGrid">
          <div class="github-stat-card loading"><div class="gh-stat-skeleton"></div></div>
          <div class="github-stat-card loading"><div class="gh-stat-skeleton"></div></div>
          <div class="github-stat-card loading"><div class="gh-stat-skeleton"></div></div>
          <div class="github-stat-card loading"><div class="gh-stat-skeleton"></div></div>
        </div>
      </div>`;
    impactSection.parentNode.insertBefore(section, impactSection.nextSibling);
    return section;
  }

  function renderStats(stats) {
    const grid = document.getElementById('ghStatsGrid');
    if (!grid) return;

    const lastCommitHref = stats.lastCommitRepoName
      ? `https://github.com/${USERNAME}/${stats.lastCommitRepoName}`
      : `https://github.com/${USERNAME}`;
    const lastCommitSub = stats.lastCommitRepoName
      ? `<span class="gh-stat-sublabel">→ ${stats.lastCommitRepoName}</span>`
      : '';

    grid.innerHTML = `
      <a href="https://github.com/${USERNAME}?tab=repositories" target="_blank" rel="noopener noreferrer" class="github-stat-card">
        <div class="gh-stat-icon"><i class="fas fa-code-branch"></i></div>
        <div class="gh-stat-value">${stats.repos}</div>
        <div class="gh-stat-label">Public Repos</div>
      </a>
      <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer" class="github-stat-card">
        <div class="gh-stat-icon"><i class="fas fa-star"></i></div>
        <div class="gh-stat-value">${stats.stars}</div>
        <div class="gh-stat-label">Stars Earned</div>
      </a>
      <div class="github-stat-card">
        <div class="gh-stat-icon"><i class="fas fa-fire"></i></div>
        <div class="gh-stat-value">${stats.recentlyActive}</div>
        <div class="gh-stat-label">Active in 30 Days</div>
      </div>
      <a href="${lastCommitHref}" target="_blank" rel="noopener noreferrer" class="github-stat-card">
        <div class="gh-stat-icon"><i class="fas fa-clock"></i></div>
        <div class="gh-stat-value">${relativeTime(stats.lastCommitTime)}</div>
        <div class="gh-stat-label">Last Commit ${lastCommitSub}</div>
      </a>`;
  }

  function renderError() {
    const grid = document.getElementById('ghStatsGrid');
    if (!grid) return;
    grid.innerHTML = `
      <div class="github-stat-error">
        <i class="fab fa-github"></i>
        <span>View my repositories directly on
          <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer">GitHub →</a>
        </span>
      </div>`;
  }

  async function init() {
    const section = injectSkeleton();
    if (!section) return;
    try {
      const stats = await fetchGitHubStats();
      renderStats(stats);
    } catch (err) {
      renderError();
    }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
