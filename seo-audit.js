/**
 * VAMSHIDHAR REDDY M — MINI SEO AUDIT TOOL
 * Powered by Google PageSpeed Insights (Lighthouse engine).
 * Real, authoritative SEO data — same audits Google uses to rank pages.
 */

(function () {
  'use strict';

  const PSI_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  ready(injectSEOAuditTool);

  function injectSEOAuditTool() {
    const projects = document.getElementById('projects');
    if (!projects) return;

    const section = document.createElement('section');
    section.id = 'seo-audit-demo';
    section.className = 'seo-audit-section';
    section.setAttribute('data-animate', 'fade-up');
    section.innerHTML = `
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-bolt"></i> Live Demo · Powered by Google Lighthouse</span>
          <h2 class="section-title">Try My SEO Agent <span class="gradient-text">Live</span></h2>
          <p class="section-desc">Paste any URL to run a real SEO audit using the same Lighthouse engine Google uses internally. This is a mini version of my full AI SEO Agent.</p>
        </div>

        <div class="seo-audit-card">
          <form class="seo-audit-form" id="seoAuditForm">
            <div class="seo-input-wrap">
              <i class="fas fa-globe seo-input-icon"></i>
              <input type="text" id="seoAuditUrl" placeholder="example.com or https://example.com" autocomplete="off" spellcheck="false" />
            </div>
            <button type="submit" class="btn btn-primary seo-audit-btn" id="seoAuditBtn">
              <i class="fas fa-play"></i>
              <span class="seo-audit-btn-text">Run Audit</span>
            </button>
          </form>

          <div class="seo-audit-hint">
            <i class="fas fa-info-circle"></i> Audit takes 20-30 seconds · Try github.com, stripe.com, or your own site
          </div>

          <div class="seo-audit-results" id="seoAuditResults" hidden></div>
        </div>
      </div>
    `;

    projects.parentNode.insertBefore(section, projects.nextSibling);
    document.getElementById('seoAuditForm').addEventListener('submit', handleSubmit);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let url = document.getElementById('seoAuditUrl').value.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    const btn = document.getElementById('seoAuditBtn');
    const btnText = btn.querySelector('.seo-audit-btn-text');
    btn.disabled = true;
    btnText.textContent = 'Running...';

    const results = document.getElementById('seoAuditResults');
    results.hidden = false;
    results.innerHTML = renderLoading(url);

    // Cycle loading messages so users know we're still working
    const loadingMessages = [
      'Crawling page...',
      'Running Lighthouse audits...',
      'Analyzing SEO factors...',
      'Generating report...',
      'Almost done — Lighthouse is thorough...'
    ];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, loadingMessages.length - 1);
      const msgEl = document.getElementById('seoAuditLoadingMsg');
      if (msgEl) msgEl.textContent = loadingMessages[msgIdx];
    }, 6000);

    try {
      const lighthouseResult = await runPSIAudit(url);
      clearInterval(msgInterval);
      const data = extractSEOData(lighthouseResult);
      results.innerHTML = renderResults(data, url);
    } catch (err) {
      clearInterval(msgInterval);
      console.error('[SEO Audit] Failed:', err);
      results.innerHTML = renderError(err.message || 'Unknown error');
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Run Audit';
    }
  }

  async function runPSIAudit(url) {
    const params = new URLSearchParams({
      url: url,
      category: 'SEO',
      strategy: 'mobile'
    });
    const apiUrl = PSI_API + '?' + params.toString();

    console.log('[SEO Audit] Calling Google PageSpeed Insights...');
    const res = await fetch(apiUrl);
    console.log('[SEO Audit] PSI returned:', res.status);

    if (!res.ok) {
      let errMsg = 'API returned HTTP ' + res.status;
      try {
        const errData = await res.json();
        if (errData && errData.error && errData.error.message) {
          errMsg = errData.error.message;
          // Strip Google-style wrapper text
          errMsg = errMsg.replace(/^Lighthouse returned error:\s*/i, '');
        }
      } catch (e) { /* ignore */ }

      if (res.status === 429) throw new Error('Rate limit reached — try again in a minute');
      if (res.status === 400) throw new Error('Invalid URL or page blocks crawling');
      if (res.status === 500) throw new Error('Google could not audit this URL. ' + errMsg);
      throw new Error(errMsg);
    }

    const data = await res.json();
    if (!data.lighthouseResult) {
      throw new Error('No Lighthouse data returned for this URL');
    }
    return data.lighthouseResult;
  }

  function extractSEOData(lighthouseResult) {
    const seoCategory = lighthouseResult.categories && lighthouseResult.categories.seo;
    if (!seoCategory) throw new Error('No SEO data in response');

    const score = Math.round((seoCategory.score || 0) * 100);
    const auditRefs = seoCategory.auditRefs || [];
    const audits = lighthouseResult.audits || {};

    const checks = [];
    for (const ref of auditRefs) {
      const audit = audits[ref.id];
      if (!audit) continue;
      if (audit.scoreDisplayMode === 'notApplicable') continue;

      let status;
      if (audit.score === 1) status = 'pass';
      else if (audit.score === 0) status = 'fail';
      else if (audit.scoreDisplayMode === 'manual' || audit.scoreDisplayMode === 'informative') status = 'info';
      else status = 'warn';

      checks.push({
        status: status,
        label: cleanText(audit.title),
        detail: cleanDescription(audit.description) || (audit.displayValue || '')
      });
    }

    return { score: score, checks: checks };
  }

  function cleanText(s) {
    if (!s) return '';
    return s.replace(/`/g, '');
  }

  function cleanDescription(desc) {
    if (!desc) return '';
    desc = desc.replace(/\[Learn (more|how)[^\]]*\]\([^)]+\)\.?/gi, '').trim();
    desc = desc.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    desc = desc.replace(/`/g, '');
    desc = desc.replace(/\s+/g, ' ').trim();
    if (desc.length > 140) desc = desc.slice(0, 137) + '...';
    return desc;
  }

  function renderLoading(url) {
    return '<div class="seo-audit-loading">' +
      '<div class="seo-audit-loading-spinner"></div>' +
      '<p>Auditing <strong>' + escapeHtml(prettyUrl(url)) + '</strong></p>' +
      '<p id="seoAuditLoadingMsg" class="seo-audit-loading-status">Crawling page...</p>' +
      '</div>';
  }

  function renderError(message) {
    return '<div class="seo-audit-error">' +
      '<i class="fas fa-exclamation-triangle"></i>' +
      '<div>' +
        '<h4>Could not audit this URL</h4>' +
        '<p>' + escapeHtml(message) + '. Try a different URL like github.com or stripe.com.</p>' +
      '</div></div>';
  }

  function renderResults(data, url) {
    const pct = data.score;
    const dashoffset = 283 - (283 * pct / 100);
    const scoreColor = pct >= 90 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444';
    const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';

    const iconMap = { pass: 'fa-check-circle', warn: 'fa-exclamation-circle', fail: 'fa-times-circle', info: 'fa-info-circle' };
    const checksHtml = data.checks.map(c =>
      '<div class="seo-check ' + c.status + '">' +
        '<i class="fas ' + iconMap[c.status] + ' seo-check-icon"></i>' +
        '<div class="seo-check-content">' +
          '<h4>' + escapeHtml(c.label) + '</h4>' +
          '<p>' + escapeHtml(c.detail) + '</p>' +
        '</div></div>'
    ).join('');

    return '<div class="seo-audit-score">' +
      '<div class="score-ring" style="--score-color: ' + scoreColor + '; --final-offset: ' + dashoffset + ';">' +
        '<svg viewBox="0 0 100 100" class="score-ring-svg">' +
          '<circle cx="50" cy="50" r="45" class="score-track"/>' +
          '<circle cx="50" cy="50" r="45" class="score-fill"/>' +
        '</svg>' +
        '<div class="score-text">' +
          '<strong>' + pct + '</strong>' +
          '<small>SEO Score</small>' +
        '</div>' +
      '</div>' +
      '<div class="score-summary">' +
        '<h3>' + escapeHtml(prettyUrl(url)) + '</h3>' +
        '<p>' + getSummary(pct) + '</p>' +
        '<div class="score-meta">Grade: <strong>' + grade + '</strong> · Powered by Google Lighthouse</div>' +
      '</div>' +
      '</div>' +
      '<div class="seo-checks-grid">' + checksHtml + '</div>' +
      '<div class="seo-audit-footer">' +
        '<div>' +
          '<strong>This is the Lighthouse SEO audit.</strong>' +
          '<p>My production AI SEO Agent goes deeper: full crawls via Playwright + Gemini AI generates prioritized action items, not just pass/fail.</p>' +
        '</div>' +
        '<a href="https://github.com/mvamshi56/seoagent" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">' +
          '<i class="fab fa-github"></i> See the full version' +
        '</a>' +
      '</div>';
  }

  function getSummary(pct) {
    if (pct >= 90) return 'Excellent — strong SEO fundamentals across the board.';
    if (pct >= 80) return 'Good — solid basics with minor improvements possible.';
    if (pct >= 70) return 'Decent — several SEO issues worth addressing.';
    if (pct >= 50) return 'Below average — important SEO problems found.';
    return 'Significant SEO improvements needed.';
  }

  function prettyUrl(url) {
    try {
      const u = new URL(url);
      return u.hostname + (u.pathname !== '/' ? u.pathname : '');
    } catch (e) { return url; }
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = String(s == null ? '' : s);
    return div.innerHTML;
  }
})();
