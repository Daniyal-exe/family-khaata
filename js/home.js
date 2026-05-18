// =============================================
// js/home.js — Family Workspace Logic
// =============================================

// Generate a random 6-character join code
function generateJoinCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ---- Create a new Home/Workspace ----
async function createHome(homeName, userId) {
  const joinCode = generateJoinCode();

  const { data: home, error } = await sb
    .from('homes')
    .insert({ home_name: homeName, join_code: joinCode, created_by: userId })
    .select()
    .single();

  if (error) throw error;

  // Link user to this home
  const { error: updateErr } = await sb
    .from('users')
    .update({ home_id: home.id })
    .eq('id', userId);

  if (updateErr) throw updateErr;

  return home;
}

// ---- Join an existing Home via code ----
async function joinHome(joinCode, userId) {
  // Find home with this code (case-insensitive)
  const { data: home, error } = await sb
    .from('homes')
    .select('*')
    .ilike('join_code', joinCode.trim().toUpperCase())
    .single();

  if (error || !home) throw new Error('Invalid join code. Please check and try again.');

  // Update user's home_id
  const { error: updateErr } = await sb
    .from('users')
    .update({ home_id: home.id })
    .eq('id', userId);

  if (updateErr) throw updateErr;

  return home;
}

// ---- Get home details ----
async function getHome(homeId) {
  const { data, error } = await sb
    .from('homes')
    .select('*')
    .eq('id', homeId)
    .single();
  if (error) throw error;
  return data;
}

// ---- Get members of a home ----
async function getHomeMembers(homeId) {
  const { data, error } = await sb
    .from('users')
    .select('id, name, email')
    .eq('home_id', homeId);
  if (error) throw error;
  return data || [];
}

// ---- Check if user needs workspace setup ----
async function checkWorkspace(userId) {
  const { data, error } = await sb
    .from('users')
    .select('home_id')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data?.home_id;
}
