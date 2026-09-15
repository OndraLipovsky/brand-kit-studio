/**
 * Convert hex color to CMYK values
 */
export function hexToCmyk(hex) {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  if (cleanHex.length !== 6) {
    return { c: 0, m: 0, y: 0, k: 100, string: "C:0% M:0% Y:0% K:100%" };
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100, string: "C:0% M:0% Y:0% K:100%" };
  }

  const c = Math.round(((1 - r - k) / (1 - k)) * 100);
  const m = Math.round(((1 - g - k) / (1 - k)) * 100);
  const y = Math.round(((1 - b - k) / (1 - k)) * 100);
  const black = Math.round(k * 100);

  return {
    c,
    m,
    y,
    k: black,
    string: `C:${c}% M:${m}% Y:${y}% K:${black}%`
  };
}

/**
 * Calculate relative luminance
 */
function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculate WCAG contrast ratio
 */
export function getContrastRatio(hex1, hex2) {
  try {
    const parse = (h) => {
      let c = h.replace("#", "");
      if (c.length === 3) c = c.split("").map(x => x + x).join("");
      return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
    };
    const [r1, g1, b1] = parse(hex1);
    const [r2, g2, b2] = parse(hex2);
    const l1 = luminance(r1, g1, b1);
    const l2 = luminance(r2, g2, b2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return Number(ratio.toFixed(1));
  } catch {
    return 1;
  }
}

/**
 * Hex to RGB string
 */
export function hexToRgb(hex) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  const r = parseInt(c.slice(0, 2), 16) || 0;
  const g = parseInt(c.slice(2, 4), 16) || 0;
  const b = parseInt(c.slice(4, 6), 16) || 0;
  return `rgb(${r}, ${g}, ${b})`;
}
