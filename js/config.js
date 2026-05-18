// =============================================
// js/config.js — Supabase Configuration
// =============================================
// STEP 1: Replace these with YOUR Supabase project credentials
// Get them from: https://supabase.com → Your Project → Settings → API

const SUPABASE_URL = 'https://zdfebdriswkkygwzgvco.supabase.co';        // e.g. https://xyzabc.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZmViZHJpc3dra3lnd3pndmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjMyNTEsImV4cCI6MjA5NDYzOTI1MX0.gWEp8GISEfMsN_IkIj_OI8HzTDNxwVxdzikYdTq7dAk'; // long string starting with eyJ...

// Initialize Supabase client
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============================================
// EXPENSE CATEGORIES with icons and colors
// =============================================
const CATEGORIES = [
  { id: 'nashta',      label: 'Nashta',        icon: '🍳', color: '#f59e0b' },
  { id: 'milk',        label: 'Milk',           icon: '🥛', color: '#06b6d4' },
  { id: 'petrol',      label: 'Petrol',         icon: '⛽', color: '#ef4444' },
  { id: 'grocery',     label: 'Grocery',        icon: '🛒', color: '#10b981' },
  { id: 'vegetables',  label: 'Vegetables',     icon: '🥦', color: '#84cc16' },
  { id: 'fruits',      label: 'Fruits',         icon: '🍎', color: '#f97316' },
  { id: 'utility',     label: 'Utility Bills',  icon: '💡', color: '#8b5cf6' },
  { id: 'snacks',      label: 'Cheez/Snacks',   icon: '🍿', color: '#ec4899' },
  { id: 'others',      label: 'Others',         icon: '📦', color: '#6b7280' },
];

// Helper: get category by id
function getCat(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

// Format currency in PKR
function formatPKR(amount) {
  return 'Rs. ' + Number(amount).toLocaleString('en-PK', { minimumFractionDigits: 0 });
}

// Format date nicely
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Get YYYY-MM-DD from a Date
function toYMD(date) {
  return date.toISOString().split('T')[0];
}

// Current YYYY-MM
function currentYM() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`;
}

// Initials from name
function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
