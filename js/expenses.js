// =============================================
// js/expenses.js — Expense CRUD Operations
// =============================================

// ---- Add a new expense ----
async function addExpense({ homeId, itemName, category, amount, notes, date, addedBy }) {
  const { data, error } = await sb
    .from('expenses')
    .insert({
      home_id: homeId,
      item_name: itemName.trim(),
      category,
      amount: parseFloat(amount),
      notes: notes?.trim() || null,
      date: date || toYMD(new Date()),
      added_by: addedBy,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- Update an expense ----
async function updateExpense(id, { itemName, category, amount, notes, date }) {
  const { data, error } = await sb
    .from('expenses')
    .update({
      item_name: itemName.trim(),
      category,
      amount: parseFloat(amount),
      notes: notes?.trim() || null,
      date: date,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- Delete an expense ----
async function deleteExpense(id) {
  const { error } = await sb.from('expenses').delete().eq('id', id);
  if (error) throw error;
}

// ---- Fetch all expenses for a home ----
async function getExpenses(homeId, filters = {}) {
  let query = sb
    .from('expenses')
    .select(`*, users(name)`)
    .eq('home_id', homeId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters.category) query = query.eq('category', filters.category);
  if (filters.search)   query = query.ilike('item_name', `%${filters.search}%`);

  // Date filtering using gte/lte instead of ilike on date column
  if (filters.month) {
    const [y, m] = filters.month.split('-');
    const firstDay = `${y}-${m}-01`;
    const lastDay = new Date(y, m, 0).toISOString().split('T')[0]; // last day of month
    query = query.gte('date', firstDay).lte('date', lastDay);
  }
  if (filters.dateFrom) query = query.gte('date', filters.dateFrom);
  if (filters.dateTo)   query = query.lte('date', filters.dateTo);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ---- Dashboard stats for current month ----
async function getMonthStats(homeId, ym) {
  const [y, m] = ym.split('-');
  const firstDay = `${y}-${m}-01`;
  const lastDay = new Date(y, m, 0).toISOString().split('T')[0];

  const { data, error } = await sb
    .from('expenses')
    .select('amount, category')
    .eq('home_id', homeId)
    .gte('date', firstDay)
    .lte('date', lastDay);

  if (error) throw error;
  const expenses = data || [];

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const highest = expenses.length ? Math.max(...expenses.map(e => Number(e.amount))) : 0;

  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount);
  });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  return {
    total,
    count: expenses.length,
    highest,
    topCategory: topCat ? getCat(topCat[0]).label : '—',
    catTotals,
  };
}

// ---- Yearly total ----
async function getYearTotal(homeId, year) {
  const firstDay = `${year}-01-01`;
  const lastDay  = `${year}-12-31`;

  const { data, error } = await sb
    .from('expenses')
    .select('amount')
    .eq('home_id', homeId)
    .gte('date', firstDay)
    .lte('date', lastDay);

  if (error) throw error;
  return (data || []).reduce((s, e) => s + Number(e.amount), 0);
}

// ---- Get per-month summary for a given year ----
async function getMonthlySummary(homeId, year) {
  const firstDay = `${year}-01-01`;
  const lastDay  = `${year}-12-31`;

  const { data, error } = await sb
    .from('expenses')
    .select('amount, date, category')
    .eq('home_id', homeId)
    .gte('date', firstDay)
    .lte('date', lastDay);

  if (error) throw error;

  const months = {};
  (data || []).forEach(e => {
    const m = e.date.slice(0, 7); // YYYY-MM
    if (!months[m]) months[m] = { total: 0, count: 0 };
    months[m].total += Number(e.amount);
    months[m].count++;
  });
  return months;
}

// ---- Get expenses for a specific month (for reports) ----
async function getExpensesByMonth(homeId, ym) {
  const [y, m] = ym.split('-');
  const firstDay = `${y}-${m}-01`;
  const lastDay = new Date(y, m, 0).toISOString().split('T')[0];

  const { data, error } = await sb
    .from('expenses')
    .select(`*, users(name)`)
    .eq('home_id', homeId)
    .gte('date', firstDay)
    .lte('date', lastDay)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ---- Subscribe to realtime changes ----
function subscribeToExpenses(homeId, callback) {
  return sb
    .channel(`home-${homeId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'expenses', filter: `home_id=eq.${homeId}` },
      callback
    )
    .subscribe();
}
