// =============================================
// js/reports.js — Report Generation (PDF + CSV)
// =============================================

// ---- Download CSV ----
function downloadCSV(expenses, monthLabel, homeName) {
  const headers = ['Date', 'Item Name', 'Category', 'Amount (PKR)', 'Notes', 'Added By'];

  const rows = expenses.map(e => [
    e.date,
    e.item_name,
    getCat(e.category).label,
    e.amount,
    e.notes || '',
    e.users?.name || 'Unknown',
  ]);

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  rows.push(['', '', 'TOTAL', total, '', '']);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Khaata_${homeName}_${monthLabel}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('CSV downloaded!');
}

// ---- Download PDF (using print/jsPDF-style HTML) ----
function downloadPDF(expenses, monthLabel, homeName) {
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const highest = expenses.length ? Math.max(...expenses.map(e => Number(e.amount))) : 0;

  // Category breakdown
  const catMap = {};
  expenses.forEach(e => {
    const l = getCat(e.category).label;
    catMap[l] = (catMap[l] || 0) + Number(e.amount);
  });
  const topCat = Object.entries(catMap).sort((a,b)=>b[1]-a[1])[0];

  const rows = expenses.map(e => `
    <tr>
      <td>${e.date}</td>
      <td>${e.item_name}</td>
      <td>${getCat(e.category).icon} ${getCat(e.category).label}</td>
      <td style="text-align:right;font-weight:600">Rs. ${Number(e.amount).toLocaleString()}</td>
      <td>${e.notes || '—'}</td>
      <td>${e.users?.name || 'Unknown'}</td>
    </tr>
  `).join('');

  const catRows = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).map(([cat, amt]) => `
    <tr>
      <td>${cat}</td>
      <td style="text-align:right">Rs. ${Number(amt).toLocaleString()}</td>
      <td style="text-align:right">${total > 0 ? Math.round(amt/total*100) : 0}%</td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Khaata Report — ${monthLabel}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; color: #1e293b; padding: 32px; font-size: 13px; }
  .header { display:flex; align-items:center; gap:12px; margin-bottom:24px; border-bottom:2px solid #2563eb; padding-bottom:16px; }
  .header .logo { background:#2563eb; color:#fff; width:44px; height:44px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
  .header h1 { font-size:24px; color:#0f172a; }
  .header p { font-size:13px; color:#64748b; margin-top:2px; }
  .summary-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
  .summary-box { background:#f0f4ff; border-radius:8px; padding:14px; text-align:center; }
  .summary-box .s-label { font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; }
  .summary-box .s-value { font-size:18px; font-weight:700; color:#1e293b; margin-top:4px; }
  h2 { font-size:14px; font-weight:700; color:#334155; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.04em; }
  table { width:100%; border-collapse:collapse; margin-bottom:24px; }
  th { background:#f0f4ff; color:#475569; font-size:11px; text-transform:uppercase; padding:9px 12px; text-align:left; border:1px solid #e2e8f0; }
  td { padding:9px 12px; border:1px solid #e2e8f0; font-size:13px; }
  tr:nth-child(even) td { background:#f8faff; }
  .total-row td { font-weight:700; background:#eff6ff; }
  .footer { margin-top:24px; text-align:center; font-size:11px; color:#94a3b8; }
  @media print { body { padding:16px; } }
</style>
</head>
<body>
<div class="header">
  <div class="logo"><i class="ri-home-4-line" aria-hidden="true"></i></div>
  <div>
    <h1>Monthly Expense Report</h1>
    <p>${homeName} &nbsp;·&nbsp; ${monthLabel}</p>
  </div>
</div>

<div class="summary-grid">
  <div class="summary-box">
    <div class="s-label">Total Spent</div>
    <div class="s-value">Rs. ${Number(total).toLocaleString()}</div>
  </div>
  <div class="summary-box">
    <div class="s-label">Expenses</div>
    <div class="s-value">${expenses.length}</div>
  </div>
  <div class="summary-box">
    <div class="s-label">Highest</div>
    <div class="s-value">Rs. ${Number(highest).toLocaleString()}</div>
  </div>
  <div class="summary-box">
    <div class="s-label">Top Category</div>
    <div class="s-value" style="font-size:14px">${topCat ? topCat[0] : '—'}</div>
  </div>
</div>

<h2>Category Breakdown</h2>
<table>
  <thead><tr><th>Category</th><th style="text-align:right">Amount</th><th style="text-align:right">Share</th></tr></thead>
  <tbody>${catRows}</tbody>
</table>

<h2>All Expenses</h2>
<table>
  <thead>
    <tr>
      <th>Date</th><th>Item</th><th>Category</th><th style="text-align:right">Amount</th><th>Notes</th><th>Added By</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
    <tr class="total-row">
      <td colspan="3">TOTAL</td>
      <td style="text-align:right">Rs. ${Number(total).toLocaleString()}</td>
      <td colspan="2"></td>
    </tr>
  </tbody>
</table>

<div class="footer">Generated by Khaata — Family Expense Manager &nbsp;·&nbsp; ${new Date().toLocaleDateString()}</div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
  toast.success('PDF report opened for printing!');
}
