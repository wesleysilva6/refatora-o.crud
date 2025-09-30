// utils/date.ts
export function fmtDate(input?: string | null) {
  if (!input) return '—';
  // converte "2025-09-29T14:08:40.000000Z" corretamente
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}
