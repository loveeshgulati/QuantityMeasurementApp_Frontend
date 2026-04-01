/* ══════════════════════════════════════════════════════════════
   QMA — Authentication Functions
   ══════════════════════════════════════════════════════════════ */

/**
 * Validate login form
 */
function validateLogin() {
  let ok = true;
  const email = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-password').value;
  document.getElementById('login-email-err').className = 'field-error';
  document.getElementById('login-pw-err').className = 'field-error';
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    document.getElementById('login-email-err').textContent = 'Enter a valid email address';
    document.getElementById('login-email-err').className = 'field-error show';
    ok = false;
  }
  if (!pw) {
    document.getElementById('login-pw-err').textContent = 'Password is required';
    document.getElementById('login-pw-err').className = 'field-error show';
    ok = false;
  }
  return ok;
}

/**
 * Validate signup form
 */
function validateSignup() {
  let ok = true;
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pw = document.getElementById('signup-password').value;
  ['signup-name-err', 'signup-email-err', 'signup-pw-err'].forEach((id) => {
    document.getElementById(id).className = 'field-error';
  });
  if (!name) {
    document.getElementById('signup-name-err').textContent = 'Full name required';
    document.getElementById('signup-name-err').className = 'field-error show';
    ok = false;
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    document.getElementById('signup-email-err').textContent = 'Valid email required';
    document.getElementById('signup-email-err').className = 'field-error show';
    ok = false;
  }
  if (!pw || pw.length < 6) {
    document.getElementById('signup-pw-err').textContent = 'Min. 6 characters';
    document.getElementById('signup-pw-err').className = 'field-error show';
    ok = false;
  }
  return ok;
}

/**
 * Login handler
 */
async function doLogin() {
  hideAlert('login-alert');
  if (!validateLogin()) return;
  setLoading('login-btn', true);
  try {
    const r = await api('POST', '/api/Auth/login', {
      Email: document.getElementById('login-email').value.trim(),
      Password: document.getElementById('login-password').value,
    });
    const token = r.data?.Token || r.data?.token;
    if (r.ok && token) {
      TOKEN = token;
      localStorage.setItem('qma_token', TOKEN);
      try {
        const p = JSON.parse(atob(TOKEN.split('.')[1]));
        const roleKey = Object.keys(p).find((k) => k.includes('role') || k === 'role');
        USER = { email: p.sub || p.email, role: roleKey ? p[roleKey] : 'User' };
      } catch {
        USER = { email: document.getElementById('login-email').value.trim(), role: 'User' };
      }
      localStorage.setItem('qma_user', JSON.stringify(USER));
      enterApp();
    } else {
      const msg = typeof r.data === 'string' ? r.data : r.data?.title || r.data?.message || 'Invalid credentials.';
      showAlert('login-alert', msg, 'err');
    }
  } catch (e) {
    showAlert('login-alert', 'Cannot reach the server. Set the correct API URL in Settings.', 'err');
  }
  setLoading('login-btn', false);
}

/**
 * Signup handler
 */
async function doSignup() {
  hideAlert('signup-alert');
  hideAlert('signup-ok');
  if (!validateSignup()) return;
  setLoading('signup-btn', true);
  try {
    const r = await api('POST', '/api/Auth/signup', {
      Name: document.getElementById('signup-name').value.trim(),
      Email: document.getElementById('signup-email').value.trim(),
      Password: document.getElementById('signup-password').value,
      Role: document.getElementById('signup-role').value,
    });
    if (r.ok) {
      showAlert('signup-ok', 'Account created! Redirecting to login...', 'ok');
      setTimeout(() => showPage('login'), 1800);
    } else {
      const msg =
        typeof r.data === 'string' ? r.data : r.data?.title || r.data?.message || 'Signup failed — email may already exist.';
      showAlert('signup-alert', msg, 'err');
    }
  } catch (e) {
    showAlert('signup-alert', 'Cannot reach the server. Set the correct API URL in Settings.', 'err');
  }
  setLoading('signup-btn', false);
}

/**
 * Enter the app after login
 */
function enterApp() {
  console.log('Entering app with user:', USER);
  console.log('Current token:', TOKEN);
  
  if (USER) {
    // Update UI elements with user info
    const navUsername = document.getElementById('nav-username');
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarRole = document.getElementById('sidebar-role');
    const guestBtn = document.getElementById('guest-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (navUsername) navUsername.textContent = USER.email || 'User';
    if (sidebarName) sidebarName.textContent = USER.name || USER.email || '—';
    if (sidebarRole) sidebarRole.textContent = USER.role ? `Role: ${USER.role}` : '';
    
    // Show logout button, hide guest/signup
    if (guestBtn) guestBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    
    // Update settings page to show current token
    const settingToken = document.getElementById('setting-token');
    if (settingToken) settingToken.value = TOKEN;
  }
  
  // Stay in the app (don't redirect since we're already there)
  showPage('app');
  showView('add');
  toast('Logged in successfully!', 'ok');
}

/**
 * Logout handler
 */
function doLogout() {
  TOKEN = '';
  USER = null;
  localStorage.removeItem('qma_token');
  localStorage.removeItem('qma_user');
  
  // Update UI to show guest user
  const navUsername = document.getElementById('nav-username');
  const sidebarName = document.getElementById('sidebar-name');
  const sidebarRole = document.getElementById('sidebar-role');
  const guestBtn = document.getElementById('guest-btn');
  const signupBtn = document.getElementById('signup-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  if (navUsername) navUsername.textContent = 'Guest';
  if (sidebarName) sidebarName.textContent = 'Guest User';
  if (sidebarRole) sidebarRole.textContent = 'Not logged in';
  
  // Show guest/signup buttons, hide logout
  if (guestBtn) guestBtn.style.display = 'block';
  if (signupBtn) signupBtn.style.display = 'block';
  if (logoutBtn) logoutBtn.style.display = 'none';
  
  // Clear token from settings
  const settingToken = document.getElementById('setting-token');
  if (settingToken) settingToken.value = '';
  
  toast('Logged out successfully!', 'info');
}
