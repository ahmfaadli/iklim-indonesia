const average = (values) => {
  const valid = values.filter(Number.isFinite);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
};

export function aggregateMonthly(dataset, selected, year) {
  const rows = dataset.filter((row) => selected.includes(row.location) && row.month.startsWith(`${year}-`));
  const grouped = new Map();
  rows.forEach((row) => {
    const month = row.month.slice(5, 7);
    if (!grouped.has(month)) grouped.set(month, []);
    grouped.get(month).push(row);
  });
  return [...grouped.entries()].sort(([a], [b]) => Number(a) - Number(b)).map(([month, items]) => ({
    month: `${year}-${month}`,
    label: new Date(`${year}-${month}-01T00:00:00`).toLocaleDateString('id-ID', { month: 'short' }),
    tempMin: average(items.map((row) => row.tempMin)),
    temp: average(items.map((row) => row.temp)),
    tempMax: average(items.map((row) => row.tempMax)),
    rain: average(items.map((row) => row.rain)),
    humidity: average(items.map((row) => row.humidity)),
    wind: average(items.map((row) => row.wind)),
    sunshine: average(items.map((row) => row.sunshine)),
  }));
}

export function aggregateYearly(dataset, selected) {
  const grouped = new Map();
  dataset.filter((row) => selected.includes(row.location)).forEach((row) => {
    const year = row.month.slice(0, 4);
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year).push(row);
  });
  return [...grouped.entries()].sort(([a], [b]) => Number(a) - Number(b)).map(([year, rows]) => ({
    year,
    temp: average(rows.map((row) => row.temp)),
    humidity: average(rows.map((row) => row.humidity)),
    rain: average(rows.map((row) => row.rain)),
  }));
}

export function aggregateProvince(dataset, year) {
  const grouped = new Map();
  dataset.filter((row) => row.month.startsWith(`${year}-`)).forEach((row) => {
    if (!grouped.has(row.location)) grouped.set(row.location, []);
    grouped.get(row.location).push(row);
  });
  return [...grouped.entries()].map(([name, rows]) => ({
    name,
    temp: average(rows.map((row) => row.temp)),
    rain: average(rows.map((row) => row.rain)),
    humidity: average(rows.map((row) => row.humidity)),
  })).filter((row) => Number.isFinite(row.temp)).sort((a, b) => b.temp - a.temp);
}
