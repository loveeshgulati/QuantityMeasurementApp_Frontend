/* ══════════════════════════════════════════════════════════════
   QMA — Configuration
   Update DEFAULT_BASE_URL to your backend port
   ══════════════════════════════════════════════════════════════ */

const DEFAULT_BASE_URL = 'http://localhost:5263';

/* STATE */
let BASE_URL = localStorage.getItem('qma_base_url') || DEFAULT_BASE_URL;
let TOKEN = localStorage.getItem('qma_token') || '';
let USER = JSON.parse(localStorage.getItem('qma_user') || 'null');
