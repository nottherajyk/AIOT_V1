import { tools } from '../tools-data.js';

export function renderNavbar() {
  const route = window.location.hash.slice(1) || '/';
  const isHome = route === '/' || route === '';
  const isImage = route.startsWith('/tool/') && ['webp-to-jpg','jpg-to-svg','base64-to-image','compress-image','png-to-jpg','svg-to-png','png-to-svg','image-cropper','invert-colors','jpg-to-png','image-to-base64','black-and-white'].includes(route.replace('/tool/',''));
  const isPdf = route.startsWith('/tool/') && ['protect-pdf','unlock-pdf','pdf-metadata','jpg-to-pdf','merge-pdf','split-pdf'].includes(route.replace('/tool/',''));
  const isSocial = route.startsWith('/tool/') && ['thumbnail-grabber','tweet-generator','youtube-tags','instagram-post','x-image-slicer'].includes(route.replace('/tool/',''));
  const isText = route.startsWith('/tool/') && !isImage && !isPdf && !isSocial && route.startsWith('/tool/');

  return `
  <nav class="navbar">
    <div class="navbar-inner">
      <a class="logo" href="#">
        <div class="logo-icon">
          <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
            <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="none" stroke="currentColor" stroke-width="4"/>
            <circle cx="32" cy="32" r="9" fill="none" stroke="currentColor" stroke-width="3"/>
            <circle cx="32" cy="32" r="3.5" fill="currentColor"/>
            <line x1="32" y1="19" x2="32" y2="24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <line x1="32" y1="40" x2="32" y2="45" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <line x1="19" y1="32" x2="24" y2="32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <line x1="40" y1="32" x2="45" y2="32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="logo-text">Snap<span>tools</span></div>
      </a>
      <div class="nav-links">
        <a class="nav-link ${isHome ? 'active' : ''}" data-nav="/">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Home
        </a>
        <a class="nav-link ${isImage ? 'active' : ''}" data-nav="/#image">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Image
        </a>
        <a class="nav-link ${isPdf ? 'active' : ''}" data-nav="/#pdf">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          PDF
        </a>
        <a class="nav-link ${isSocial ? 'active' : ''}" data-nav="/#social">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Social
        </a>
        <a class="nav-link ${isText ? 'active' : ''}" data-nav="/#text">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          Text
        </a>
      </div>
      <button class="nav-search-btn" id="navSearchBtn" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span class="search-kbd">Ctrl K</span>
      </button>
      <button class="hamburger" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>
    </div>
  </nav>
  <!-- Search overlay -->
  <div class="search-overlay" id="searchOverlay">
    <div class="search-modal">
      <div class="search-input-row">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="Search all tools…" id="globalSearch" autocomplete="off" />
        <kbd class="search-esc" id="searchCloseBtn">esc</kbd>
      </div>
      <div class="search-results" id="searchResults">
        <div class="search-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".35"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <p>Type to search ${tools.length} tools…</p>
        </div>
      </div>
    </div>
  </div>`;
}
