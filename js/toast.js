// =============================================
// js/toast.js — Toast Notifications
// =============================================

// Create the container once
function ensureToastContainer() {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}

// Show a toast message
// type: 'success' | 'error' | 'warning' | 'info'
function showToast(message, type = 'info', duration = 3500) {
  const container = ensureToastContainer();

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Convenience shortcuts
const toast = {
  success: (msg) => showToast(msg, 'success'),
  error:   (msg) => showToast(msg, 'error'),
  warning: (msg) => showToast(msg, 'warning'),
  info:    (msg) => showToast(msg, 'info'),
};
