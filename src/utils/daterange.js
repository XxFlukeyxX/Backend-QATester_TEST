export function thaiDateToUtcRange(dateStr) {
  const startLocal = new Date(`${dateStr}T00:00:00+07:00`);
  const endLocal = new Date(`${dateStr}T24:00:00+07:00`);

  const toMySQL = d => d.toISOString().slice(0, 19).replace('T', ' '); // UTC
  return {
    startUtc: toMySQL(startLocal),
    endUtc: toMySQL(endLocal)
  };
}
