export function percent(value: bigint, total: bigint) {
  if (total === 0n) return 0;
  return Number((value * 100n) / total);
}

export function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function shortAddress(address: string) {
  if (!address.startsWith("0x") || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function shortHash(hash: string) {
  if (!hash.startsWith("0x") || hash.length < 12) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export function displayAddress(address: string) {
  return isHexAddress(address) ? shortAddress(address) : escapeHtml(address);
}

export function isHexAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
