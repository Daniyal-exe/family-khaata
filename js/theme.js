// =============================================
// js/theme.js — Dark / Light Mode
// =============================================

function initTheme() {
  // Load saved preference; default to light
  const saved = localStorage.getItem('khaata_theme') || 'light';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('khaata_theme', theme);
  // Update all toggle buttons on the page
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Call on every page load
initTheme();
