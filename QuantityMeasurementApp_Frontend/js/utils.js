/* ══════════════════════════════════════════════════════════════
   QMA — Utility Functions
   ══════════════════════════════════════════════════════════════ */

/**
 * Toggle password visibility
 */
function togglePw(id, btn) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
}

/**
 * Set loading state on a button
 */
function setLoading(id, on) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled = on;
  btn.classList.toggle('loading', on);
}

/**
 * Show an alert message
 */
function showAlert(id, msg, type = 'err') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
}

/**
 * Hide an alert message
 */
function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.className = 'alert';
}

/**
 * Show a toast notification
 */
function toast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  const icon = type === 'ok' ? '[OK]' : type === 'err' ? '[X]' : '[i]';
  t.innerHTML = `<span>${icon}</span>${msg}`;
  container.appendChild(t);
  setTimeout(() => {
    t.classList.add('hide');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

/**
 * Convert unit code to label
 */
function unitLabel(u) {
  return { FEET: 'ft', INCHES: 'in', YARDS: 'yd', CENTIMETERS: 'cm' }[u] || u || '';
}

/**
 * Format a number (remove trailing zeros)
 */
function fmtNum(n) {
  if (typeof n !== 'number') return n ?? '—';
  const s = n.toFixed(6).replace(/\.?0+$/, '');
  return s;
}

/**
 * Set result box content
 */
function setResultBox(boxId, value, unit, label) {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.innerHTML = `
    <div>
      <div class="result-label">${label}</div>
      <div class="result-value">${fmtNum(value)}</div>
      ${unit ? `<div class="result-unit">${unit}</div>` : ''}
    </div>
    <div style="font-size:28px">[OK]</div>`;
}

/**
 * Clear operation fields
 */
function clearOp(prefix) {
  const resultId = prefix + '-result';
  const box = document.getElementById(resultId);
  const labels = { add: 'Sum', sub: 'Difference', div: 'Ratio', cvt: 'Converted Value' };
  if (box)
    box.innerHTML = `<div><div class="result-label">${labels[prefix] || 'Result'}</div><div class="result-empty">Enter values and press Calculate</div></div>`;
  if (prefix === 'cmp') {
    const v = document.getElementById('cmp-verdict');
    if (v) v.style.display = 'none';
  }
  hideAlert(prefix + '-alert');
}
