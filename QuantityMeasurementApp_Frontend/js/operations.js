/* ══════════════════════════════════════════════════════════════
   QMA — Operations (Add, Subtract, Divide, Compare, Convert)
   ══════════════════════════════════════════════════════════════ */

/* Measurement units configuration */
const MEASUREMENT_UNITS = {
  Length: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  Temperature: ['CELSIUS', 'FAHRENHEIT'],
  Volume: ['LITRE', 'MILLILITRE', 'GALLON'],
  Weight: ['KILOGRAM', 'GRAM', 'POUND']
};

/**
 * Update unit dropdowns for a specific operation
 */
function updateUnitsForOperation(operation) {
  const measurementType = document.getElementById(operation + '-measurement-type')?.value || 'Length';
  const units = MEASUREMENT_UNITS[measurementType] || MEASUREMENT_UNITS.Length;
  
  const unit1Select = document.getElementById(operation + '-u1');
  const unit2Select = document.getElementById(operation + '-u2');
  
  if (unit1Select) {
    unit1Select.innerHTML = units.map(unit => `<option value="${unit}">${unitLabel(unit)}</option>`).join('');
  }
  
  if (unit2Select) {
    unit2Select.innerHTML = units.map(unit => `<option value="${unit}">${unitLabel(unit)}</option>`).join('');
  }
}

/**
 * Update available operations based on measurement type
 */
function updateAvailableOperations(measurementType) {
  const addNav = document.getElementById('nav-add');
  const subtractNav = document.getElementById('nav-subtract');
  const divideNav = document.getElementById('nav-divide');
  const compareNav = document.getElementById('nav-compare');
  const convertNav = document.getElementById('nav-convert');
  
  if (measurementType === 'Temperature') {
    // Temperature only supports Compare and Convert
    addNav.style.display = 'none';
    subtractNav.style.display = 'none';
    divideNav.style.display = 'none';
    compareNav.style.display = 'block';
    convertNav.style.display = 'block';
    
    // Always redirect to Convert if Add/Subtract/Divide was selected
    const activeView = document.querySelector('.app-view.active');
    if (activeView && ['add', 'subtract', 'divide'].includes(activeView.id.replace('view-', ''))) {
      showView('convert');
    }
  } else {
    // Other types support all operations
    addNav.style.display = 'block';
    subtractNav.style.display = 'block';
    divideNav.style.display = 'block';
    compareNav.style.display = 'block';
    convertNav.style.display = 'block';
  }
  
  // Force immediate update of sidebar visibility
  setTimeout(() => {
    // Double-check the current measurement type and update visibility
    const currentMeasurementType = document.querySelector('.app-view.active')?.id;
    if (currentMeasurementType) {
      const operation = currentMeasurementType.replace('view-', '');
      const measurementTypeSelect = document.getElementById(operation + '-measurement-type');
      if (measurementTypeSelect && measurementTypeSelect.value === 'Temperature') {
        addNav.style.display = 'none';
        subtractNav.style.display = 'none';
        divideNav.style.display = 'none';
      }
    }
  }, 10);
}

/* Operation configurations */
const OP_CONFIG = {
  add: { prefix: 'add', endpoint: '/api/v1/quantities/add', label: 'Sum', btnId: 'add-btn' },
  subtract: { prefix: 'sub', endpoint: '/api/v1/quantities/subtract', label: 'Difference', btnId: 'sub-btn' },
  divide: { prefix: 'div', endpoint: '/api/v1/quantities/divide', label: 'Ratio', btnId: 'div-btn' },
};

/**
 * Perform Add/Subtract/Divide operation
 */
async function doOperation(op) {
  const cfg = OP_CONFIG[op];
  hideAlert(cfg.prefix + '-alert');
  const v1 = document.getElementById(cfg.prefix + '-v1').value;
  const v2 = document.getElementById(cfg.prefix + '-v2').value;
  const u1 = document.getElementById(cfg.prefix + '-u1').value;
  const u2 = document.getElementById(cfg.prefix + '-u2').value;
  if (!v1 || !v2) {
    showAlert(cfg.prefix + '-alert', 'Please enter both values.', 'err');
    return;
  }
  if (op === 'divide' && parseFloat(v2) === 0) {
    showAlert(cfg.prefix + '-alert', 'Cannot divide by zero.', 'err');
    return;
  }
  setLoading(cfg.btnId, true);
  try {
    const r = await api('POST', cfg.endpoint, {
      ThisQuantityDTO: makeQty(v1, u1),
      ThatQuantityDTO: makeQty(v2, u2),
    });
    if (r.ok) {
      const d = r.data;
      // Backend returns QuantityDTO { Value, Unit, MeasurementType }
      const val = d?.value ?? d?.Value ?? (typeof d === 'number' ? d : null);
      const unit = d?.unit ?? d?.Unit ?? u1;
      setResultBox(cfg.prefix + '-result', val, op !== 'divide' ? unitLabel(unit) : null, cfg.label);
      toast(`${cfg.label} calculated!`, 'ok');
    } else {
      const msg = typeof r.data === 'string' ? r.data : r.data?.error || r.data?.message || 'Operation failed.';
      showAlert(cfg.prefix + '-alert', msg, 'err');
    }
  } catch (e) {
    showAlert(cfg.prefix + '-alert', 'Network error — is the API running?', 'err');
  }
  setLoading(cfg.btnId, false);
}

/**
 * Compare two quantities
 */
async function doCompare() {
  hideAlert('cmp-alert');
  const v1 = document.getElementById('cmp-v1').value;
  const v2 = document.getElementById('cmp-v2').value;
  const u1 = document.getElementById('cmp-u1').value;
  const u2 = document.getElementById('cmp-u2').value;
  if (!v1 || !v2) {
    showAlert('cmp-alert', 'Please enter both values.', 'err');
    return;
  }
  setLoading('cmp-btn', true);
  const vd = document.getElementById('cmp-verdict');
  vd.style.display = 'flex';
  vd.className = 'compare-verdict pending';
  document.getElementById('cmp-icon').textContent = '...';
  document.getElementById('cmp-text').textContent = 'Comparing...';
  try {
    const r = await api('POST', '/api/v1/quantities/compare', {
      ThisQuantityDTO: makeQty(v1, u1),
      ThatQuantityDTO: makeQty(v2, u2),
    });
    if (r.ok) {
      // CompareQuantities returns a double (the difference). 0 = equal.
      const diff = r.data?.result ?? r.data?.Result ?? r.data;
      const equal = Math.abs(parseFloat(diff)) < 0.00001;
      vd.className = 'compare-verdict ' + (equal ? 'equal' : 'notequal');
      document.getElementById('cmp-icon').textContent = equal ? '[OK]' : '[X]';
      document.getElementById('cmp-text').textContent = equal
        ? `${v1} ${unitLabel(u1)} equals ${v2} ${unitLabel(u2)} — VALUES ARE EQUAL`
        : `${v1} ${unitLabel(u1)} does not equal ${v2} ${unitLabel(u2)} — VALUES ARE NOT EQUAL (Diff = ${fmtNum(parseFloat(diff))})`;
      toast(equal ? 'Equal!' : 'Not equal.', equal ? 'ok' : 'info');
    } else {
      const msg = typeof r.data === 'string' ? r.data : r.data?.error || 'Comparison failed.';
      showAlert('cmp-alert', msg, 'err');
      vd.style.display = 'none';
    }
  } catch (e) {
    showAlert('cmp-alert', 'Network error — is the API running?', 'err');
    vd.style.display = 'none';
  }
  setLoading('cmp-btn', false);
}

/**
 * Convert a quantity to another unit
 */
async function doConvert() {
  hideAlert('cvt-alert');
  const v1 = document.getElementById('cvt-v1').value;
  const u1 = document.getElementById('cvt-u1').value;
  const u2 = document.getElementById('cvt-u2').value;
  if (!v1) {
    showAlert('cvt-alert', 'Please enter a value.', 'err');
    return;
  }
  if (u1 === u2) {
    showAlert('cvt-alert', 'Source and target units are the same.', 'err');
    return;
  }
  setLoading('cvt-btn', true);
  try {
    const r = await api('POST', '/api/v1/quantities/convert', {
      QuantityDTO: makeQty(v1, u1),
      TargetUnit: u2,
    });
    if (r.ok) {
      const d = r.data;
      const val = d?.value ?? d?.Value;
      const unit = d?.unit ?? d?.Unit ?? u2;
      setResultBox('cvt-result', val, unitLabel(unit), 'Converted Value');
      toast('Conversion done!', 'ok');
    } else {
      const msg = typeof r.data === 'string' ? r.data : r.data?.error || 'Conversion failed.';
      showAlert('cvt-alert', msg, 'err');
    }
  } catch (e) {
    showAlert('cvt-alert', 'Network error — is the API running?', 'err');
  }
  setLoading('cvt-btn', false);
}

/**
 * Load operation history
 */
async function loadHistory() {
  hideAlert('history-alert');
  
  // Check if user is logged in
  if (!USER || !TOKEN) {
    document.getElementById('history-body').innerHTML = `
      <tr>
        <td colspan="6" class="hist-empty">
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
            <div style="font-size: 18px; font-weight: 600; color: var(--navy); margin-bottom: 8px;">Login Required</div>
            <div style="font-size: 14px; color: var(--gray); margin-bottom: 20px;">Please login to view your operation history</div>
            <button class="btn btn-primary" onclick="showPage('login')">Login Now</button>
          </div>
        </td>
      </tr>
    `;
    document.getElementById('history-meta').textContent = '';
    return;
  }
  
  document.getElementById('history-body').innerHTML = '<tr><td colspan="6" class="hist-empty">Loading...</td></tr>';
  document.getElementById('history-meta').textContent = '';
  try {
    const r = await api('GET', '/api/v1/quantities/history/all');
    if (r.ok) {
      const source = r.data?.Source ?? r.data?.source ?? 'Unknown';
      const items = r.data?.Data ?? r.data?.data ?? [];
      const srcCls = source.toLowerCase().includes('cache') ? 'source-cache' : 'source-db';
      document.getElementById('history-meta').innerHTML = `${items.length} record(s) &mdash; Source: <span class="source-badge ${srcCls}">${source}</span>`;
      if (!items.length) {
        document.getElementById('history-body').innerHTML = '<tr><td colspan="6" class="hist-empty">No operations recorded yet.</td></tr>';
        return;
      }
      document.getElementById('history-body').innerHTML = items
        .map((op, i) => {
          const opName = (op.Operation ?? op.operation ?? '').toLowerCase();
          return `<tr>
          <td>${i + 1}</td>
          <td><span class="op-pill pill-${opName}">${opName || '—'}</span></td>
          <td>${op.FirstValue ?? op.firstValue ?? '—'} <strong>${unitLabel(op.FirstUnit ?? op.firstUnit ?? '')}</strong></td>
          <td>${op.SecondValue ?? op.secondValue ?? '—'} <strong>${unitLabel(op.SecondUnit ?? op.secondUnit ?? '')}</strong></td>
          <td><strong>${fmtNum(op.Result ?? op.result ?? null)}</strong></td>
          <td>${op.MeasurementType ?? op.measurementType ?? 'Length'}</td>
        </tr>`;
        })
        .join('');
      toast(`${items.length} records from ${source}`, 'info');
    } else {
      showAlert('history-alert', typeof r.data === 'string' ? r.data : r.data?.error || 'Failed to load history.', 'err');
      document.getElementById('history-body').innerHTML = '<tr><td colspan="6" class="hist-empty">Could not load data.</td></tr>';
    }
  } catch (e) {
    showAlert('history-alert', 'Network error — is the API running?', 'err');
    document.getElementById('history-body').innerHTML = '<tr><td colspan="6" class="hist-empty">Network error.</td></tr>';
  }
}
