/* ══════════════════════════════════════════════════════════════
   QMA — Main Application Logic (Routing, Initialization)
   ══════════════════════════════════════════════════════════════ */

/**
 * Go back to previous page
 */
function goBack() {
  const currentPage = document.querySelector('.page.active')?.id;
  
  // Define navigation logic based on current page
  const navigationMap = {
    'page-login': 'home',
    'page-signup': 'login',
    'page-app': 'home',
    'page-home': null // Can't go back from home
  };
  
  const targetPage = navigationMap[currentPage];
  
  if (targetPage) {
    showPage(targetPage);
  } else if (currentPage === 'page-home') {
    // If we're on home page, we can't go back - show message or stay
    toast('Already on home page', 'info');
  }
}

/**
 * Show a specific page
 */
function showPage(name) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo(0, 0);
  
  // Initialize app operations when showing the app page
  if (name === 'app') {
    showView('add');
    
    // Initialize operations for all views
    if (typeof updateAvailableOperations === 'function') {
      ['add', 'subtract', 'divide', 'compare', 'convert'].forEach(op => {
        const measurementType = document.getElementById(op + '-measurement-type')?.value || 'Length';
        updateAvailableOperations(measurementType);
      });
    }
  }
}

/**
 * Show a specific view within the app
 */
function showView(name) {
  document.querySelectorAll('.app-view').forEach((v) => v.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav a').forEach((a) => a.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  const nav = document.getElementById('nav-' + name);
  if (nav) nav.classList.add('active');
  if (name === 'history') loadHistory();
  
  // Initialize units for current view and update operations
  if (['add', 'subtract', 'divide', 'compare', 'convert'].includes(name)) {
    const measurementType = document.getElementById(name + '-measurement-type')?.value || 'Length';
    if (typeof updateAvailableOperations === 'function') {
      updateAvailableOperations(measurementType);
    }
  }
}

/**
 * Handle keyboard events (Enter key for forms)
 */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const id = document.querySelector('.page.active')?.id;
  if (id === 'page-login') doLogin();
  if (id === 'page-signup') doSignup();
});

/**
 * Initialize the app
 */
(function init() {
  document.getElementById('setting-baseurl').value = BASE_URL;
  
  // Show home page first so users can see login options
  showPage('home');
  
  // Update UI with user info if logged in, otherwise show guest
  const navUsername = document.getElementById('nav-username');
  const sidebarName = document.getElementById('sidebar-name');
  const sidebarRole = document.getElementById('sidebar-role');
  const guestBtn = document.getElementById('guest-btn');
  const signupBtn = document.getElementById('signup-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  if (USER) {
    if (navUsername) navUsername.textContent = USER.email || 'User';
    if (sidebarName) sidebarName.textContent = USER.name || USER.email || '—';
    if (sidebarRole) sidebarRole.textContent = USER.role ? `Role: ${USER.role}` : '';
    
    // Show logout button, hide guest/signup
    if (guestBtn) guestBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
  } else {
    if (navUsername) navUsername.textContent = 'Guest';
    if (sidebarName) sidebarName.textContent = 'Guest User';
    if (sidebarRole) sidebarRole.textContent = 'Not logged in';
    
    // Show guest/signup buttons, hide logout
    if (guestBtn) guestBtn.style.display = 'block';
    if (signupBtn) signupBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
})();
