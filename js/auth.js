// =============================================
// js/auth.js — Authentication Logic
// =============================================

// ---- Check session ----
async function checkAuthRedirect() {
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session) window.location.href = 'dashboard.html';
  } catch (err) {
    console.error('Session check error:', err);
  }
}

// ---- Protect page ----
async function requireAuth() {
  try {
    const { data: { session }, error } = await sb.auth.getSession();
    if (error) throw error;
    if (!session) { window.location.href = 'index.html'; return null; }
    return session.user;
  } catch (err) {
    console.error('requireAuth error:', err);
    window.location.href = 'index.html';
    return null;
  }
}

// ---- Sign Up ----
async function signUp(name, email, password) {
  const { data, error } = await sb.auth.signUp({
    email, password,
    options: { data: { name } }
  });
  if (error) throw error;

  // Insert into users table — best effort, dashboard will auto-create too
  if (data.user) {
    await sb.from('users').insert({
      id: data.user.id,
      name,
      email,
      home_id: null
    }).then(({ error: insErr }) => {
      if (insErr && insErr.code !== '23505') console.warn('User insert warning:', insErr.message);
    });
  }
  return data;
}

// ---- Sign In ----
async function signIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// ---- Sign Out ----
async function signOut() {
  await sb.auth.signOut();
  window.location.href = 'index.html';
}
