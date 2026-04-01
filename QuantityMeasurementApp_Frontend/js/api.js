/* ══════════════════════════════════════════════════════════════
   QMA — API Functions
   ══════════════════════════════════════════════════════════════ */

/**
 * Make an API request
 */
async function api(method, path, body) {
  const url = BASE_URL.replace(/\/+$/, '') + path;
  const headers = { 'Content-Type': 'application/json' };
  if (TOKEN) headers['Authorization'] = 'Bearer ' + TOKEN;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  let data;
  try {
    data = await res.json();
  } catch {
    data = await res.text().catch(() => '');
  }
  return { ok: res.ok, status: res.status, data };
}

/**
 * Create a quantity DTO object
 */
function makeQty(value, unit) {
  return { Value: parseFloat(value), Unit: unit, MeasurementType: 'Length' };
}
