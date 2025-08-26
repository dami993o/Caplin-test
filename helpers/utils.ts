
//removes symbols from string
export function parsePercentage(text: string): number {
  const cleaned = text.replace('%', '').trim();
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : value;
}
//converts from string to number 
export function parseMarketCap(text: string): number {
  const cleaned = text.replace(/[^0-9.]/g, '').trim();
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : value;
}

