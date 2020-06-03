// Webpack "fingerprinting" style e.g. index.a1b2c3d4.js
const EIGHT_OR_MORE_HEX_DIGITS = /[.-\/][0-9A-Fa-f]{8,}[.-]/

// NanoID style (used by NextJS)
const NANO_ID_PATTEN = /[A-Za-z0-9_-]{21,}/

export const DEFAULT_IMMUTABILITY_CHECK = new RegExp(
  [EIGHT_OR_MORE_HEX_DIGITS, NANO_ID_PATTEN].map((r) => r.source).join('|')
)
