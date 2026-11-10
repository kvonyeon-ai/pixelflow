const PASSWORD = process.env.ADMIN_PASSWORD ?? "sh05sh06";

/** Edge-compatible token derivation (no node:crypto needed) */
export function makeAdminToken(): string {
  let h = 0x811c9dc5;
  const str = PASSWORD + "__pixel_flow_admin__";
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const a = (h >>> 0).toString(36);
  let h2 = 0x1f351f35;
  for (let i = str.length - 1; i >= 0; i--) {
    h2 ^= str.charCodeAt(i);
    h2 = Math.imul(h2, 0x01000193);
  }
  const b = (h2 >>> 0).toString(36);
  return `pf_${a}_${b}_${PASSWORD.length}`;
}

export function getAdminPassword(): string {
  return PASSWORD;
}
