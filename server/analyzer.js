import axios from "axios";
import * as cheerio from "cheerio";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import namesPlugin from "colord/plugins/names";
import https from "https";

extend([a11yPlugin, namesPlugin]);

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * Calculates CMYK values from an RGB hex code.
 * Essential for physical print, vinyl cutting, vehicle/truck wraps, and apparel.
 */
export function hexToCmyk(hex) {
  const c = colord(hex);
  const rgb = c.toRgb();
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100, string: "C:0% M:0% Y:0% K:100%" };
  }

  const cyan = Math.round(((1 - r - k) / (1 - k)) * 100);
  const magenta = Math.round(((1 - g - k) / (1 - k)) * 100);
  const yellow = Math.round(((1 - b - k) / (1 - k)) * 100);
  const black = Math.round(k * 100);

  return {
    c: cyan,
    m: magenta,
    y: yellow,
    k: black,
    string: `C:${cyan}% M:${magenta}% Y:${yellow}% K:${black}%`
  };
}

/**
 * Resolve relative URL to absolute URL.
 */
function resolveUrl(relative, base) {
  if (!relative) return "";
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}

/**
 * Clean and normalize text
 */
function cleanText(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Extract Google Fonts from HTML links and CSS @import
 */
function extractGoogleFonts($, cssContent) {
  const fonts = new Set();
  
  // From HTML link tags
  $('link[href*="fonts.googleapis.com"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    try {
      const url = new URL(href);
      const familyParams = url.searchParams.getAll("family");
      for (const param of familyParams) {
        const familyName = param.split(":")[0].replace(/\+/g, " ");
        if (familyName) fonts.add(familyName);
      }
    } catch {
      // fallback regex
      const match = href.match(/family=([^:&]+)/g);
      if (match) {
        match.forEach(m => {
          const name = m.replace("family=", "").replace(/\+/g, " ");
          if (name) fonts.add(name);
        });
      }
    }
  });

  // From CSS @import
  const importRegex = /@import\s+url\(['"]?(https:\/\/fonts\.googleapis\.com\/css2?\?[^'"]+)['"]?\)/gi;
  let match;
  while ((match = importRegex.exec(cssContent)) !== null) {
    const href = match[1];
    try {
      const url = new URL(href);
      const familyParams = url.searchParams.getAll("family");
      for (const param of familyParams) {
        const familyName = param.split(":")[0].replace(/\+/g, " ");
        if (familyName) fonts.add(familyName);
      }
    } catch {
      // ignore
    }
  }

  return Array.from(fonts);
}

/**
 * Extract font families declared in CSS
 */
function extractCssFontFamilies(cssContent) {
  const families = new Map();
  const regex = /font-family\s*:\s*([^;!}]+)/gi;
  let match;
  
  const systemFonts = new Set([
    "sans-serif", "serif", "monospace", "system-ui", "-apple-system",
    "blinkmacsystemfont", "segoe ui", "roboto", "helvetica neue", "arial",
    "inherit", "initial", "unset"
  ]);

  while ((match = regex.exec(cssContent)) !== null) {
    const rawList = match[1].split(",");
    const primary = rawList[0].trim().replace(/['"]/g, "");
    if (primary && primary.length > 1 && !primary.startsWith("var(")) {
      const lower = primary.toLowerCase();
      families.set(primary, (families.get(primary) || 0) + 1);
    }
  }

  // Sort by occurrence
  return Array.from(families.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

/**
 * Extract colors from CSS and inline styles
 */
function extractColorsFromCss(cssContent, htmlContent) {
  const colorCounts = new Map();

  // 1. CSS Custom Properties / Variables (e.g. --primary: #..., --brand: ...)
  const varRegex = /--([a-zA-Z0-9_-]*(?:brand|primary|secondary|accent|color|theme|bg|main)[a-zA-Z0-9_-]*)\s*:\s*([^;!}]+)/gi;
  const namedVars = [];
  let varMatch;
  while ((varMatch = varRegex.exec(cssContent)) !== null) {
    const varName = varMatch[1];
    const val = varMatch[2].trim();
    if (colord(val).isValid()) {
      const hex = colord(val).toHex();
      namedVars.push({ name: varName, hex });
      colorCounts.set(hex, (colorCounts.get(hex) || 0) + 5); // higher weight
    }
  }

  // 2. All Hex codes
  const hexRegex = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;
  let hexMatch;
  while ((hexMatch = hexRegex.exec(cssContent)) !== null) {
    const hex = hexMatch[0];
    if (colord(hex).isValid()) {
      const c = colord(hex);
      if (c.alpha() >= 0.4) {
        // Force 6-character hex without alpha
        const rgb = c.toRgb();
        const norm = colord({ r: rgb.r, g: rgb.g, b: rgb.b }).toHex();
        colorCounts.set(norm, (colorCounts.get(norm) || 0) + 1);
      }
    }
  }

  // 3. rgb/rgba/hsl
  const rgbRegex = /(?:rgb|hsl)a?\([^)]+\)/gi;
  let rgbMatch;
  while ((rgbMatch = rgbRegex.exec(cssContent)) !== null) {
    const val = rgbMatch[0];
    if (colord(val).isValid()) {
      const norm = colord(val).toHex();
      colorCounts.set(norm, (colorCounts.get(norm) || 0) + 1);
    }
  }

  // Also check inline style colors in HTML
  let htmlHexMatch;
  while ((htmlHexMatch = hexRegex.exec(htmlContent)) !== null) {
    const hex = htmlHexMatch[0];
    if (colord(hex).isValid()) {
      const c = colord(hex);
      if (c.alpha() >= 0.4) {
        // Force 6-character hex without alpha
        const rgb = c.toRgb();
        const norm = colord({ r: rgb.r, g: rgb.g, b: rgb.b }).toHex();
        colorCounts.set(norm, (colorCounts.get(norm) || 0) + 1);
      }
    }
  }

  // Filter out pure whites/blacks or extremely close ones into separate categories
  const sorted = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([hex, count]) => ({ hex, count }));

  return { sortedColors: sorted, namedVars };
}

/**
 * Classify extracted colors into a coherent Brand Palette:
 * Primary, Secondary, Accent, Dark Neutral, Light Neutral, and extra swatches.
 */
function colorDistance(hex1, hex2) {
  const rgb1 = colord(hex1).toRgb();
  const rgb2 = colord(hex2).toRgb();
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function buildBrandPalette(sortedColors, namedVars, metaThemeColor) {
  const result = [];
  const usedHexes = new Set();

  function isDistinct(hex) {
    for (const u of usedHexes) {
      if (colorDistance(hex, u) < 40) return false;
    }
    return true;
  }

  function addColor(hex, role, label) {
    if (!colord(hex).isValid()) return;
    const norm = colord(hex).toHex();
    const c = colord(norm);
    const rgb = c.toRgb();
    const hsl = c.toHsl();
    const cmyk = hexToCmyk(norm);
    const isDark = c.isDark();
    
    // Contrast with white and black
    const contrastWhite = c.contrast("#ffffff");
    const contrastBlack = c.contrast("#000000");

    result.push({
      id: "color-" + Math.random().toString(36).substr(2, 9),
      role,
      label: label || role,
      hex: norm,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      cmyk,
      isDark,
      contrastWhite: Number(contrastWhite.toFixed(1)),
      contrastBlack: Number(contrastBlack.toFixed(1)),
      suggestedUsage: getUsageSuggestion(role, isDark)
    });
    usedHexes.add(norm);
  }

  function getUsageSuggestion(role, isDark) {
    switch (role) {
      case "Primary Brand":
        return "Main vehicle vinyl color, hero accents, main CTA buttons, primary logo mark";
      case "Secondary Brand":
        return "Vehicle stripes/accents, secondary buttons, subheadings, badges";
      case "Accent":
        return "High-visibility highlights, emergency contact/phone badge on trucks, icons";
      case "Dark Neutral":
        return "Body typography, dark vehicle panels, high-contrast door lettering";
      case "Light Neutral":
        return "Vehicle wrap background (white/off-white), card backgrounds, negative space";
      default:
        return "Complementary accents, borders, print accents";
    }
  }

  // Priority 1: Meta theme-color if specified
  if (metaThemeColor && colord(metaThemeColor).isValid()) {
    const norm = colord(metaThemeColor).toHex();
    if (!usedHexes.has(norm) && !colord(norm).isEqual("#ffffff") && !colord(norm).isEqual("#000000")) {
      addColor(norm, "Primary Brand", "Primary Theme");
    }
  }

  // Priority 2: Named CSS variables matching brand/primary
  for (const v of namedVars) {
    if (result.length >= 6) break;
    if (!usedHexes.has(v.hex) && isDistinct(v.hex)) {
      const role = result.length === 0 ? "Primary Brand" : (result.length === 1 ? "Secondary Brand" : "Accent");
      addColor(v.hex, role, v.name.replace(/[-_]/g, " ").toUpperCase());
    }
  }

  // Priority 3: Vibrant/chromatic colors from CSS
  const chromatic = sortedColors.filter(c => {
    const col = colord(c.hex);
    const hsl = col.toHsl();
    // chromatic: saturation > 20% and lightness between 15% and 85%
    return hsl.s > 20 && hsl.l > 15 && hsl.l < 85;
  });

  for (const item of chromatic) {
    if (result.length >= 4) break;
    if (isDistinct(item.hex)) {
      const role = result.length === 0 ? "Primary Brand" : (result.length === 1 ? "Secondary Brand" : "Accent");
      addColor(item.hex, role, role);
    }
  }

  // Priority 4: Dark Neutral (Text / Dark Vehicle panels)
  const darks = sortedColors.filter(c => colord(c.hex).toHsl().l <= 25);
  if (darks.length > 0) {
    const bestDark = darks.find(d => isDistinct(d.hex)) || darks[0];
    if (bestDark && isDistinct(bestDark.hex)) {
      addColor(bestDark.hex, "Dark Neutral", "Dark Neutral / Typography");
    }
  }
  if (!result.some(r => r.role === "Dark Neutral")) {
    addColor("#1e293b", "Dark Neutral", "Deep Slate (Text)");
  }

  // Priority 5: Light Neutral (Page Surface / White Vehicle background)
  const lights = sortedColors.filter(c => colord(c.hex).toHsl().l >= 90);
  if (lights.length > 0) {
    const bestLight = lights.find(l => isDistinct(l.hex)) || lights[0];
    if (bestLight && isDistinct(bestLight.hex)) {
      addColor(bestLight.hex, "Light Neutral", "Light Neutral / Surface");
    }
  }
  if (!result.some(r => r.role === "Light Neutral")) {
    addColor("#f8fafc", "Light Neutral", "Off-White / Surface");
  }

  // Fill up to 6 colors if we have more distinct colors
  for (const item of sortedColors) {
    if (result.length >= 6) break;
    if (isDistinct(item.hex)) {
      addColor(item.hex, "Accent", `Accent ${result.length}`);
    }
  }

  // Fallback if website was empty or purely monochrome
  if (result.length === 0) {
    addColor("#2563eb", "Primary Brand", "Primary Blue");
    addColor("#0ea5e9", "Secondary Brand", "Secondary Sky");
    addColor("#f59e0b", "Accent", "Accent Amber");
    addColor("#0f172a", "Dark Neutral", "Dark Neutral");
    addColor("#ffffff", "Light Neutral", "Clean White");
  }

  return result;
}

/**
 * Extract the header logo (Image, SVG, or styled Text wordmark)
 */
function extractLogo($, baseUrl, htmlContent) {
  const candidates = [];

  // Search containers: header, nav, [role=banner], .header, .navbar, #header
  const headerContainers = $("header, nav, [role='banner'], .header, .navbar, #header, .nav, .site-header, div[class*='header'], div[class*='navbar']");

  // Helper to test if an element is inside header or top of page
  function isHeaderEl(el) {
    return $(el).parents("header, nav, [role='banner'], .header, .navbar, #header").length > 0;
  }

  // 1. Look for <img> tags matching logo
  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    const alt = $(el).attr("alt") || "";
    const className = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    const parentA = $(el).closest("a");
    const href = parentA.attr("href") || "";

    const isHeader = isHeaderEl(el);
    const matchScore = (
      (src.toLowerCase().includes("logo") ? 4 : 0) +
      (alt.toLowerCase().includes("logo") ? 4 : 0) +
      (className.toLowerCase().includes("logo") ? 3 : 0) +
      (id.toLowerCase().includes("logo") ? 3 : 0) +
      (isHeader ? 3 : 0) +
      (href === "/" || href === baseUrl || href.endsWith("/") ? 2 : 0)
    );

    if (matchScore >= 3 && src) {
      candidates.push({
        type: "image",
        src: resolveUrl(src, baseUrl),
        alt: cleanText(alt),
        score: matchScore,
        width: $(el).attr("width") || null,
        height: $(el).attr("height") || null,
        inHeader: isHeader
      });
    }
  });

  // 2. Look for <svg> tags inside header or matching logo
  $("svg").each((_, el) => {
    const parentA = $(el).closest("a");
    const href = parentA.attr("href") || "";
    const className = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    const ariaLabel = $(el).attr("aria-label") || "";
    const parentClass = $(el).parent().attr("class") || "";

    const isHeader = isHeaderEl(el);
    const score = (
      (className.toLowerCase().includes("logo") ? 5 : 0) +
      (id.toLowerCase().includes("logo") ? 5 : 0) +
      (parentClass.toLowerCase().includes("logo") ? 4 : 0) +
      (ariaLabel.toLowerCase().includes("logo") ? 4 : 0) +
      (isHeader && (href === "/" || href.endsWith("/")) ? 4 : 0) +
      (isHeader ? 2 : 0)
    );

    if (score >= 3) {
      const svgHtml = $.html(el);
      // Create SVG Data URI
      const encodedSvg = "data:image/svg+xml;utf8," + encodeURIComponent(svgHtml);
      candidates.push({
        type: "svg",
        src: encodedSvg,
        svgContent: svgHtml,
        alt: ariaLabel || cleanText(parentA.text()) || "Logo SVG",
        score,
        inHeader: isHeader
      });
    }
  });

  // 3. Look for text-based wordmark logos (Very common for modern brands e.g. text in top-left)
  headerContainers.find("a, span, h1, div").each((_, el) => {
    const text = cleanText($(el).text());
    const className = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    const href = $(el).attr("href") || "";

    // Text logo must be concise (1-4 words) and high in visual prominence
    const isLogoClass = className.toLowerCase().includes("logo") || 
                        className.toLowerCase().includes("brand") || 
                        id.toLowerCase().includes("logo") || 
                        id.toLowerCase().includes("brand");

    const isHomeLink = href === "/" || href === baseUrl || href === "#";

    if (text && text.length > 1 && text.length <= 40 && (isLogoClass || (isHomeLink && text.length < 25))) {
      const score = (isLogoClass ? 5 : 0) + (isHomeLink ? 3 : 0) + 1;
      candidates.push({
        type: "text",
        textWordmark: text,
        score,
        inHeader: true
      });
    }
  });

  // Sort candidates by score
  candidates.sort((a, b) => b.score - a.score);

  // Return primary logo and list of all candidates for user to choose
  const primaryLogo = candidates[0] || {
    type: "text",
    textWordmark: $("title").text().split(/[|\-–]/)[0].trim() || "Brand Name",
    score: 1,
    inHeader: true
  };

  return {
    primary: primaryLogo,
    allCandidates: candidates.slice(0, 6)
  };
}

/**
 * Extract favicon
 */
function extractFavicon($, baseUrl) {
  const iconLinks = [];

  $("link[rel*='icon'], link[rel='apple-touch-icon'], link[rel='apple-touch-icon-precomposed']").each((_, el) => {
    const href = $(el).attr("href");
    const rel = $(el).attr("rel") || "";
    const sizes = $(el).attr("sizes") || "";
    if (href) {
      iconLinks.push({
        url: resolveUrl(href, baseUrl),
        rel,
        sizes,
        isAppleTouch: rel.includes("apple-touch-icon"),
        isSvg: href.endsWith(".svg")
      });
    }
  });

  // Best icon selection: prefer SVG > Apple Touch (180x180) > 32x32 > fallback
  let bestIcon = iconLinks.find(i => i.isSvg)?.url ||
                 iconLinks.find(i => i.isAppleTouch)?.url ||
                 iconLinks[0]?.url;

  if (!bestIcon) {
    try {
      const urlObj = new URL(baseUrl);
      bestIcon = `${urlObj.origin}/favicon.ico`;
    } catch {
      bestIcon = "";
    }
  }

  return {
    faviconUrl: bestIcon,
    allIcons: iconLinks
  };
}

/**
 * Detect Icon Libraries and Tech Stack
 */
function detectTechAndIcons($, htmlContent, cssContent) {
  const icons = [];
  const tech = [];

  // Icon libraries
  if (htmlContent.includes("fa-") || htmlContent.includes("fontawesome") || cssContent.includes("font-awesome")) {
    icons.push({ name: "FontAwesome", type: "Icon Font / SVG" });
  }
  if (htmlContent.includes("lucide") || cssContent.includes("lucide")) {
    icons.push({ name: "Lucide Icons", type: "Modern Clean SVG" });
  }
  if (htmlContent.includes("heroicon") || htmlContent.includes("heroicons")) {
    icons.push({ name: "Heroicons", type: "Tailwind SVG Icons" });
  }
  if (htmlContent.includes("material-icons") || cssContent.includes("Material Icons")) {
    icons.push({ name: "Google Material Icons", type: "Icon Font" });
  }
  if (htmlContent.includes("bi-") || cssContent.includes("bootstrap-icons")) {
    icons.push({ name: "Bootstrap Icons", type: "Icon Font / SVG" });
  }
  if ($("svg").length > 0) {
    icons.push({ name: `Inline SVG (${$("svg").length} found)`, type: "Custom Vector SVGs" });
  }

  // Frameworks & CMS
  if (htmlContent.includes("tailwind") || cssContent.includes("tailwindcss") || /class="[^"]*(?:flex|grid|px-\d|py-\d|text-[a-z]+-\d{2,3})[^"]*"/.test(htmlContent)) {
    tech.push("Tailwind CSS");
  }
  if (htmlContent.includes("bootstrap") || cssContent.includes("bootstrap")) {
    tech.push("Bootstrap");
  }
  if (htmlContent.includes("__NEXT_DATA__") || htmlContent.includes("_next/static")) {
    tech.push("Next.js / React");
  } else if (htmlContent.includes("react") || htmlContent.includes("react-dom")) {
    tech.push("React");
  }
  if (htmlContent.includes("wp-content") || htmlContent.includes("wordpress")) {
    tech.push("WordPress");
  }
  if (htmlContent.includes("cdn.shopify.com") || htmlContent.includes("Shopify.theme")) {
    tech.push("Shopify");
  }
  if (htmlContent.includes("w-layout") || htmlContent.includes("webflow")) {
    tech.push("Webflow");
  }

  return { icons, tech };
}

/**
 * Main analysis function
 */
export async function analyzeWebsite(targetUrl) {
  let url = targetUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    },
    timeout: 15000,
    maxRedirects: 5,
    httpsAgent
  });

  const finalUrl = response.request?.res?.responseUrl || url;
  const html = response.data;
  const $ = cheerio.load(html);

  // Extract base URL
  const baseHref = $("base").attr("href");
  const baseUrl = baseHref ? resolveUrl(baseHref, finalUrl) : finalUrl;

  // 1. Brand Name & Meta
  const title = cleanText($("title").text());
  const ogSiteName = cleanText($('meta[property="og:site_name"]').attr("content"));
  const ogTitle = cleanText($('meta[property="og:title"]').attr("content"));
  const metaDesc = cleanText($('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content"));
  const metaThemeColor = $('meta[name="theme-color"]').attr("content") || "";

  // Compute brand name guess
  let brandName = ogSiteName || "";
  if (!brandName && title) {
    brandName = title.split(/[|\-–:•—]/)[0].trim();
  }
  if (!brandName) {
    try {
      const parsed = new URL(baseUrl);
      brandName = parsed.hostname.replace(/^www\./, "").split(".")[0];
      brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
    } catch {
      brandName = "Brand Name";
    }
  }

  // 2. Fetch linked stylesheets
  const stylesheetUrls = [];
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      stylesheetUrls.push(resolveUrl(href, baseUrl));
    }
  });

  let combinedCss = "";
  // Include inline styles
  $("style").each((_, el) => {
    combinedCss += "\n" + $(el).text();
  });

  // Fetch up to 5 external stylesheets concurrently with 5s timeout
  const cssPromises = stylesheetUrls.slice(0, 5).map(async (cssUrl) => {
    try {
      const cssRes = await axios.get(cssUrl, {
        timeout: 5000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        httpsAgent
      });
      return cssRes.data;
    } catch (e) {
      return "";
    }
  });

  const fetchedCss = await Promise.all(cssPromises);
  combinedCss += "\n" + fetchedCss.join("\n");

  // 3. Extract Typography
  const googleFonts = extractGoogleFonts($, combinedCss);
  const cssFonts = extractCssFontFamilies(combinedCss);

  const headingFont = googleFonts[0] || cssFonts[0] || "Inter";
  const bodyFont = googleFonts[1] || cssFonts[1] || cssFonts[0] || "system-ui, -apple-system, sans-serif";

  const typographyHierarchy = [
    { level: "H1", name: "Heading 1 (Hero Title)", size: "48px / 3rem", weight: "700 Bold", lineHeight: "1.1", font: headingFont, sampleText: `${brandName} — Official Brand Identity` },
    { level: "H2", name: "Heading 2 (Section Title)", size: "32px / 2rem", weight: "600 SemiBold", lineHeight: "1.25", font: headingFont, sampleText: "Crafted with precision & purpose" },
    { level: "H3", name: "Heading 3 (Card / Feature Title)", size: "24px / 1.5rem", weight: "600 SemiBold", lineHeight: "1.3", font: headingFont, sampleText: "Vehicle Wrap & Signage Specs" },
    { level: "H4", name: "Heading 4 (Subheadings)", size: "18px / 1.125rem", weight: "500 Medium", lineHeight: "1.4", font: headingFont, sampleText: "Official Color Specifications" },
    { level: "Body", name: "Body Text (Paragraphs)", size: "16px / 1rem", weight: "400 Regular", lineHeight: "1.6", font: bodyFont, sampleText: "Consistent brand presentation across digital platforms, truck livery, and merchandise builds trust and customer recognition." },
    { level: "Button", name: "Button / CTA Text", size: "14px / 0.875rem", weight: "600 SemiBold", lineHeight: "1.0", font: bodyFont, sampleText: "CONTACT US / CALL NOW" },
    { level: "Caption", name: "Caption / Legal / Micro", size: "12px / 0.75rem", weight: "400 Regular", lineHeight: "1.4", font: bodyFont, sampleText: "© All rights reserved. CMYK print calibrated." }
  ];

  // 4. Extract Colors
  const { sortedColors, namedVars } = extractColorsFromCss(combinedCss, html);
  const palette = buildBrandPalette(sortedColors, namedVars, metaThemeColor);

  // 5. Extract Logo
  const logoData = extractLogo($, baseUrl, html);

  // 6. Extract Favicon
  const faviconData = extractFavicon($, baseUrl);

  // 7. Detect Tech & Icons
  const { icons, tech } = detectTechAndIcons($, html, combinedCss);

  // 8. Vehicle Wrap & Print Guidelines (computed for this specific brand)
  const primaryColor = palette.find(c => c.role === "Primary Brand") || palette[0];
  const secondaryColor = palette.find(c => c.role === "Secondary Brand") || palette[1] || palette[0];
  const darkColor = palette.find(c => c.role === "Dark Neutral") || { hex: "#111827", cmyk: { string: "C:0% M:0% Y:0% K:93%" } };
  const lightColor = palette.find(c => c.role === "Light Neutral") || { hex: "#ffffff", cmyk: { string: "C:0% M:0% Y:0% K:0%" } };

  const printSpecs = {
    truckWrapRecommendations: {
      baseVehicleColor: primaryColor.isDark ? "White / Light Gray vehicle paint recommended for maximum contrast" : "Dark Navy / Charcoal or White vehicle wrap",
      hoodLivery: `Primary Brand Color (${primaryColor.hex}) with high-contrast text`,
      doorLettering: `Minimum 3.5 inches (9 cm) height for readability at 30 mph (50 km/h)`,
      phoneAndWebText: `High contrast (${darkColor.hex} on light surfaces, or ${lightColor.hex} on dark surfaces)`,
      finishRecommendation: "Gloss Cast Vinyl (3M IJ180Cv3 or Avery Dennison MPI 1105) with UV laminate"
    },
    cmykTable: palette.map(c => ({
      role: c.role,
      label: c.label,
      hex: c.hex,
      cmyk: c.cmyk.string,
      c: c.cmyk.c,
      m: c.cmyk.m,
      y: c.cmyk.y,
      k: c.cmyk.k
    })),
    clearspaceRule: "Maintain minimum 1x 'X-height' clearspace around the logo mark free of text or vehicle seams/handles.",
    minPrintSize: "1.0 inch (25.4 mm) width for physical print; 8.0 inches (200 mm) for vehicle doors."
  };

  return {
    success: true,
    url: finalUrl,
    hostname: new URL(finalUrl).hostname,
    brandName,
    tagline: metaDesc || `Official brand identity and design kit for ${brandName}`,
    logo: logoData.primary,
    logoCandidates: logoData.allCandidates,
    favicon: faviconData.faviconUrl,
    allFavicons: faviconData.allIcons,
    palette,
    typography: {
      headingFont,
      bodyFont,
      googleFonts,
      detectedCssFonts: cssFonts.slice(0, 8),
      hierarchy: typographyHierarchy
    },
    icons,
    tech,
    printSpecs
  };
}


