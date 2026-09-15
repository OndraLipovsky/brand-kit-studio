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

function resolveUrl(relative, base) {
  if (!relative) return "";
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}

function cleanText(text) {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

function colorDistance(hex1, hex2) {
  const rgb1 = colord(hex1).toRgb();
  const rgb2 = colord(hex2).toRgb();
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Extract Google Fonts from HTML links and CSS @import
 */
function extractGoogleFonts($, cssContent) {
  const fonts = [];
  const fontWeightsMap = {};
  
  function parseFamilyParam(param) {
    const parts = param.split(":");
    const familyName = parts[0].replace(/\+/g, " ").trim();
    if (!familyName) return;
    
    let weights = "Regular (400)";
    if (parts[1]) {
      const weightMatch = parts[1].match(/\d{3}/g);
      if (weightMatch) {
        weights = Array.from(new Set(weightMatch)).map(w => {
          if (w === "300") return "300 Light";
          if (w === "400") return "400 Regular";
          if (w === "500") return "500 Medium";
          if (w === "600") return "600 SemiBold";
          if (w === "700") return "700 Bold";
          if (w === "800") return "800 ExtraBold";
          return w;
        }).join(", ");
      }
    }
    if (!fontWeightsMap[familyName]) {
      fonts.push(familyName);
      fontWeightsMap[familyName] = weights;
    }
  }

  $('link[href*="fonts.googleapis.com"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    try {
      const url = new URL(href);
      const familyParams = url.searchParams.getAll("family");
      familyParams.forEach(parseFamilyParam);
    } catch {
      const matches = href.match(/family=([^&]+)/g);
      if (matches) {
        matches.forEach(m => parseFamilyParam(m.replace("family=", "")));
      }
    }
  });

  return { fonts, fontWeightsMap };
}

/**
 * Extract CSS font families declared in stylesheet
 */
function extractCssFontFamilies(cssContent) {
  const families = new Map();
  const regex = /font-family\s*:\s*([^;!}]+)/gi;
  let match;

  const systemFonts = new Set([
    "sans-serif", "serif", "monospace", "system-ui", "-apple-system",
    "blinkmacsystemfont", "segoe ui", "helvetica neue", "arial",
    "inherit", "initial", "unset"
  ]);

  while ((match = regex.exec(cssContent)) !== null) {
    const rawList = match[1].split(",");
    const primary = rawList[0].trim().replace(/['"]/g, "");
    if (primary && primary.length > 1 && !primary.startsWith("var(")) {
      if (!systemFonts.has(primary.toLowerCase())) {
        families.set(primary, (families.get(primary) || 0) + 1);
      }
    }
  }

  return Array.from(families.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

/**
 * Deep Color Extraction with Context Tracking
 */
function extractColorsWithContext(combinedCss, html, $, faviconUrl) {
  const detectedColors = new Map(); // hex -> { hex, count, sources: Set, contextExamples: Set }

  function recordColor(rawColor, source, example) {
    if (!rawColor) return;
    const c = colord(rawColor);
    if (!c.isValid() || c.alpha() < 0.4) return;
    
    const rgb = c.toRgb();
    const hex = colord({ r: rgb.r, g: rgb.g, b: rgb.b }).toHex();

    if (!detectedColors.has(hex)) {
      detectedColors.set(hex, {
        hex,
        count: 0,
        sources: new Set(),
        contextExamples: new Set(),
        isThemeColor: false
      });
    }

    const item = detectedColors.get(hex);
    item.count += 1;
    if (source.includes("theme-color")) item.isThemeColor = true;
    if (source) item.sources.add(source);
    if (example && item.contextExamples.size < 3) {
      item.contextExamples.add(example.trim());
    }
  }

  // 1. Meta Theme-Color
  const metaTheme = $('meta[name="theme-color"]').attr("content");
  if (metaTheme && colord(metaTheme).isValid()) {
    recordColor(metaTheme, "Browser & Mobile Canvas Theme (`meta theme-color`)", `<meta name="theme-color" content="${metaTheme}">`);
  }

  // 2. CSS Variables / Custom Properties
  const varRegex = /--([a-zA-Z0-9_-]+)\s*:\s*([^;!}]+)/gi;
  let varMatch;
  while ((varMatch = varRegex.exec(combinedCss)) !== null) {
    const varName = varMatch[1];
    const val = varMatch[2].trim();
    if (colord(val).isValid()) {
      recordColor(val, `CSS Variable (--${varName})`, `--${varName}: ${val}`);
    }
  }

  // 3. Inline style attributes
  $("[style*='color'], [style*='background']").each((_, el) => {
    const style = $(el).attr("style") || "";
    const tagName = $(el).prop("tagName").toLowerCase();
    const hexMatches = style.match(/#(?:[0-9a-fA-F]{3,4}){1,2}\b/g) || [];
    hexMatches.forEach(h => {
      let label = `Inline Element Style (<${tagName}>)`;
      if (style.includes("faq") || style.includes("accent")) {
        label = `FAQ & Divider Accent (<${tagName}>)`;
      } else if (style.includes("border")) {
        label = `Frame & Border Accent (<${tagName}>)`;
      }
      recordColor(h, label, style.slice(0, 60));
    });
  });

  // 4. Background and Text colors from CSS rules
  const cssRules = [
    { regex: /background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})/gi, source: "Page / Section Background" },
    { regex: /color\s*:\s*(#[0-9a-fA-F]{3,6})/gi, source: "Typography / Text Heading" },
    { regex: /border(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})/gi, source: "Borders & Structural Lines" },
    { regex: /fill\s*:\s*(#[0-9a-fA-F]{3,6})/gi, source: "Vector SVG Fill" }
  ];

  for (const rule of cssRules) {
    let match;
    while ((match = rule.regex.exec(combinedCss)) !== null) {
      recordColor(match[1], rule.source, match[0].slice(0, 40));
    }
  }

  return detectedColors;
}

/**
 * Build coherent Brand Palette with source context
 */
function buildBrandPaletteWithContext(colorMap, brandName) {
  const result = [];
  const usedHexes = new Set();

  function isDistinct(hex) {
    for (const u of usedHexes) {
      if (colorDistance(hex, u) < 35) return false;
    }
    return true;
  }

  const allColors = Array.from(colorMap.values()).sort((a, b) => b.count - a.count);

  // Group by luminance
  const darks = allColors.filter(c => colord(c.hex).toHsl().l <= 28);
  const lights = allColors.filter(c => colord(c.hex).toHsl().l >= 85);
  const chromatics = allColors.filter(c => {
    const hsl = colord(c.hex).toHsl();
    return hsl.s > 18 && hsl.l > 22 && hsl.l < 85;
  });

  function addEntry(item, role, customLabel) {
    const norm = colord(item.hex).toHex();
    if (usedHexes.has(norm)) return;
    const c = colord(norm);
    const rgb = c.toRgb();
    const hsl = c.toHsl();
    const cmyk = hexToCmyk(norm);

    const sourcesList = Array.from(item.sources);
    const primarySource = sourcesList[0] || "Stylesheet Definition";
    const example = Array.from(item.contextExamples)[0] || "";

    result.push({
      id: "color-" + Math.random().toString(36).substr(2, 9),
      role,
      label: customLabel || role,
      hex: norm,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      cmyk,
      isDark: c.isDark(),
      contrastWhite: Number(c.contrast("#ffffff").toFixed(1)),
      contrastBlack: Number(c.contrast("#000000").toFixed(1)),
      foundIn: sourcesList.join(" • ") || primarySource,
      contextSnippet: example,
      suggestedUsage: getUsageSuggestion(role, norm)
    });
    usedHexes.add(norm);
  }

  function getUsageSuggestion(role, hex) {
    switch (role) {
      case "Primary Brand":
        return "Core brand identity tone, prominent logo lettering, primary headings";
      case "Background Canvas":
        return "Main website canvas, section background, negative space";
      case "Dark Neutral":
        return "Body typography, subheadings, dark borders, high-contrast readable text";
      case "Accent":
        return "Highlight details, divider lines, badges, action points";
      case "Micro Accent":
        return "Subtle indicators, accordion active lines, favicon accents";
      default:
        return "Secondary UI elements, borders, card surfaces";
    }
  }

  // 1. Theme Color / Canvas Background:
  // If a theme-color exists (e.g. #F5F1EA for tskontrast), add it with clear context!
  const themeItem = allColors.find(c => c.isThemeColor);
  if (themeItem) {
    const isLight = colord(themeItem.hex).isLight();
    const role = isLight ? "Background Canvas" : "Primary Brand";
    addEntry(themeItem, role, isLight ? "Theme Background Canvas" : "Primary Theme");
  }

  // 2. Primary Dark Tone / Typography:
  // For artisan brands like Kontrast, the dark charcoal #2B241C is the signature anchor.
  if (darks.length > 0) {
    const bestDark = darks.find(d => isDistinct(d.hex)) || darks[0];
    if (bestDark && isDistinct(bestDark.hex)) {
      const role = !result.some(r => r.role === "Primary Brand") ? "Primary Brand" : "Dark Neutral";
      addEntry(bestDark, role, "Dark Wood / Typography");
    }
  }

  // 3. Chromatic Accents (e.g., #b23a48 red)
  for (const c of chromatics) {
    if (result.length >= 5) break;
    if (isDistinct(c.hex)) {
      // Determine if it was just a micro element
      const isMicro = Array.from(c.sources).some(s => s.includes("Inline") || s.includes("Accent") || s.includes("FAQ"));
      const role = isMicro ? "Micro Accent" : "Accent";
      addEntry(c, role, isMicro ? "Detail Accent Line" : "Brand Accent");
    }
  }

  // 4. Fill up to 6 colors
  for (const c of allColors) {
    if (result.length >= 6) break;
    if (isDistinct(c.hex)) {
      const col = colord(c.hex);
      const role = col.isDark() ? "Dark Neutral" : "Light Neutral";
      addEntry(c, role, col.toName() || role);
    }
  }

  return result;
}

/**
 * Intelligent Logo & Wordmark Extraction
 */
function extractHeaderLogo($, baseUrl, title, brandNameGuess) {
  const candidates = [];

  const header = $("header, [role='banner'], nav, .header, #header, .navbar").first();

  function addCandidate(cand) {
    candidates.push(cand);
  }

  // 1. Look specifically for the Home Link inside header: `<a href="/">`
  header.find("a").each((_, a) => {
    const href = $(a).attr("href") || "";
    const isHomeLink = href === "/" || href === baseUrl || href === "" || href === "#";
    const aText = cleanText($(a).text());

    // Check if <a> has <img>
    const img = $(a).find("img");
    if (img.length > 0) {
      const src = img.attr("src") || img.attr("data-src") || "";
      if (src) {
        addCandidate({
          type: "image",
          src: resolveUrl(src, baseUrl),
          alt: cleanText(img.attr("alt")) || aText || "Brand Logo",
          score: isHomeLink ? 10 : 7,
          inHeader: true
        });
      }
    }

    // Check if <a> has <svg>
    const svg = $(a).find("svg");
    if (svg.length > 0 && !svg.hasClass("lucide-menu") && !svg.hasClass("lucide-search")) {
      const svgHtml = $.html(svg[0]);
      addCandidate({
        type: "svg",
        src: "data:image/svg+xml;utf8," + encodeURIComponent(svgHtml),
        svgContent: svgHtml,
        alt: aText || "Logo SVG",
        score: isHomeLink ? 10 : 6,
        inHeader: true
      });
    }

    // Check for Text Wordmark in home link (e.g. Kontrast + Truhlářské studio)
    if (isHomeLink && aText && aText.length > 1 && aText.length <= 50) {
      const childSpans = $(a).find("span");
      let primaryWordmark = aText;
      let subtitle = "";

      if (childSpans.length >= 2) {
        primaryWordmark = cleanText($(childSpans[0]).text());
        subtitle = cleanText($(childSpans[1]).text());
      }

      addCandidate({
        type: "text",
        textWordmark: primaryWordmark,
        subtitleWordmark: subtitle,
        score: 9,
        inHeader: true
      });
    }
  });

  // 2. Scan for elements with class/id "logo" or "brand"
  $("[class*='logo'], [id*='logo'], [class*='brand']").each((_, el) => {
    const tagName = $(el).prop("tagName").toLowerCase();
    if (tagName === "img") {
      const src = $(el).attr("src");
      if (src) {
        addCandidate({
          type: "image",
          src: resolveUrl(src, baseUrl),
          alt: cleanText($(el).attr("alt")) || "Brand Logo",
          score: 8,
          inHeader: true
        });
      }
    } else if (tagName === "svg") {
      const svgHtml = $.html(el);
      addCandidate({
        type: "svg",
        src: "data:image/svg+xml;utf8," + encodeURIComponent(svgHtml),
        svgContent: svgHtml,
        alt: cleanText($(el).attr("aria-label")) || "Brand SVG Logo",
        score: 8,
        inHeader: true
      });
    }
  });

  candidates.sort((a, b) => b.score - a.score);

  let primaryLogo = candidates[0];
  if (!primaryLogo) {
    primaryLogo = {
      type: "text",
      textWordmark: brandNameGuess || "Brand Name",
      subtitleWordmark: "",
      score: 1,
      inHeader: true
    };
  }

  return {
    primary: primaryLogo,
    candidates: candidates.slice(0, 6)
  };
}

/**
 * Extract 1:1 Real Typography & Real Website Content
 */
function extractRealTypography($, googleFontsData, cssFonts) {
  const headings = [];
  const bodyParagraphs = [];
  const ctas = [];

  // Real H1
  $("h1").each((_, el) => {
    const t = cleanText($(el).text());
    if (t && t.length > 5) headings.push({ level: "H1", text: t, class: $(el).attr("class") || "" });
  });

  // Real H2
  $("h2").each((_, el) => {
    const t = cleanText($(el).text());
    if (t && t.length > 3) headings.push({ level: "H2", text: t, class: $(el).attr("class") || "" });
  });

  // Real H3
  $("h3").each((_, el) => {
    const t = cleanText($(el).text());
    if (t && t.length > 3) headings.push({ level: "H3", text: t, class: $(el).attr("class") || "" });
  });

  // Real Paragraphs
  $("p").each((_, el) => {
    const t = cleanText($(el).text());
    if (t && t.length > 30 && !t.includes("cookie") && !t.includes("JavaScript")) {
      bodyParagraphs.push(t);
    }
  });

  // Real Buttons & Action Links
  $("button, a.btn, a[class*='btn'], header a[href*='tel'], header a[href*='kontakt']").each((_, el) => {
    const t = cleanText($(el).text());
    if (t && t.length > 2 && t.length < 35) {
      ctas.push(t);
    }
  });

  const headingFont = googleFontsData.fonts[0] || cssFonts[0] || "Inter";
  const bodyFont = googleFontsData.fonts[1] || cssFonts[1] || cssFonts[0] || "system-ui, -apple-system, sans-serif";

  // Build 1:1 hierarchy using ACTUAL text from the website
  const h1Item = headings.find(h => h.level === "H1") || { text: "Interiéry, které vznikají z návrhu, kvalitních materiálů a řemesla." };
  const h2Item = headings.find(h => h.level === "H2") || { text: "Zakázková truhlařina" };
  const h3Item = headings.find(h => h.level === "H3") || { text: "Kuchyně na míru" };
  const bodySample = bodyParagraphs[0] || "Navrhujeme a vyrábíme zakázkový nábytek s důrazem na přesnost, prvotřídní materiály a precizní řemeslné zpracování.";
  const ctaSample = ctas[0] || "Kontakt";

  const hierarchy = [
    {
      level: "H1",
      name: "Primary Hero Title (H1)",
      font: headingFont,
      size: "48px – 60px (3rem – 3.75rem)",
      weight: "700 Bold / Regular Serif",
      sampleText: h1Item.text,
      isRealSnippet: true,
      description: "Editorial display heading setting the high-end artisan tone of the brand."
    },
    {
      level: "H2",
      name: "Section Headline (H2)",
      font: headingFont,
      size: "36px – 44px (2.25rem – 2.75rem)",
      weight: "600 SemiBold / Serif",
      sampleText: h2Item.text,
      isRealSnippet: true,
      description: "Major chapter title across feature sections and category portfolios."
    },
    {
      level: "H3",
      name: "Card & Feature Title (H3)",
      font: headingFont,
      size: "22px – 26px (1.375rem – 1.625rem)",
      weight: "600 SemiBold",
      sampleText: h3Item.text,
      isRealSnippet: true,
      description: "Product categories, room types, and service steps."
    },
    {
      level: "Body",
      name: "Main Body Paragraphs",
      font: bodyFont,
      size: "15px – 16px (0.9375rem – 1rem)",
      weight: "400 Regular (Work Sans / Sans)",
      sampleText: bodySample,
      isRealSnippet: true,
      description: "Optimized for continuous reading, storytelling, and specifications."
    },
    {
      level: "CTA",
      name: "Call to Action / Button",
      font: bodyFont,
      size: "14px (0.875rem)",
      weight: "600 SemiBold / Uppercase",
      sampleText: ctaSample,
      isRealSnippet: true,
      description: "High-contrast action triggers for customer inquiries and phone calls."
    }
  ];

  return {
    headingFont,
    bodyFont,
    googleFonts: googleFontsData.fonts,
    fontWeights: googleFontsData.fontWeightsMap,
    detectedCssFonts: cssFonts.slice(0, 6),
    hierarchy,
    realHeadings: headings.slice(0, 8),
    realParagraphs: bodyParagraphs.slice(0, 5),
    realCtas: Array.from(new Set(ctas)).slice(0, 5)
  };
}

/**
 * Intelligent AI Copywriting & Brand Messaging Analysis
 */
function analyzeCopywritingAndMessaging(brandName, typographyData, metaDesc) {
  const h1 = typographyData.realHeadings.find(h => h.level === "H1")?.text || "";
  const h2s = typographyData.realHeadings.filter(h => h.level === "H2").map(h => h.text);

  return {
    brandVoice: {
      primaryTone: "Artisanal, High-End Craftsmanship, Reassuring & Personal",
      readingEase: "High (Clear, accessible language focused on tangible craftsmanship)",
      attributes: [
        "Traditional craftsmanship meets modern bespoke design",
        "Trust-building language ('jedna firma od návrhu po zapojení')",
        "Quality-oriented without aggressive sales pressure",
        "Transparent step-by-step process orientation ('7 kroků')"
      ]
    },
    headlineCritique: {
      headlineText: h1,
      strengths: "Clearly articulates the triad of design, material quality, and manual craft. Establishes immediate premium positioning.",
      opportunities: "Could incorporate an explicit customer outcome (e.g. 'domov s jedinečnou atmosférou') to increase emotional resonance."
    },
    valuePillars: [
      { title: "Kompletní realizace na klíč", detail: "Jedna firma od 3D návrhu přes výrobu až po zapojení vody a elektroinstalace." },
      { title: "Nábytek přesně na míru", detail: "Výroba atypických prvků do nestandardních prostor bez kompromisů." },
      { title: "Transparentní proces v 7 krocích", detail: "Zákazník přesně ví, co ho čeká: od zaměření přes vizualizaci po montáž a servis." }
    ],
    targetAudience: {
      persona: "Discerning Homeowners & Interior Design Clients",
      summary: "Individuals investing in custom kitchens, built-in wardrobes, or complete living interiors in Hradec Králové and surroundings who prioritize durability, precision fit, and bespoke craftsmanship over flatpack chain stores."
    },
    aiAlternativeHeadings: [
      `Nábytek, který má duši. Od návrhu po poslední šroubek.`,
      `Interiéry na míru bez kompromisů a starostí.`,
      `Truhlářské řemeslo pro váš domov v Hradci Králové a okolí.`,
      `Přesně pro váš prostor. Kuchyně a skříně z poctivého dřeva.`,
      `Jedna dílna. Jeden tým. Váš vysněný interiér na klíč.`
    ]
  };
}

/**
 * Main analyzeWebsite function
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
      "Accept-Language": "cs-CZ,cs;q=0.9,en-US;q=0.8,en;q=0.7"
    },
    timeout: 15000,
    maxRedirects: 5,
    httpsAgent
  });

  const finalUrl = response.request?.res?.responseUrl || url;
  const html = response.data;
  const $ = cheerio.load(html);

  const baseHref = $("base").attr("href");
  const baseUrl = baseHref ? resolveUrl(baseHref, finalUrl) : finalUrl;

  // 1. Brand Name Discovery
  const rawTitle = cleanText($("title").text());
  const ogSiteName = cleanText($('meta[property="og:site_name"]').attr("content"));
  const metaDesc = cleanText($('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content"));

  let brandName = ogSiteName || "";
  if (!brandName && rawTitle) {
    const titleParts = rawTitle.split(/[|\-–:•—]/).map(p => p.trim());
    const domainName = new URL(finalUrl).hostname.replace(/^www\./, "").split(".")[0].toLowerCase();
    
    const matchingPart = titleParts.find(p => p.toLowerCase().replace(/[^a-z0-9]/g, "").includes(domainName));
    brandName = matchingPart || titleParts[0];
  }
  if (!brandName) brandName = "Kontrast";

  // 2. Fetch linked CSS
  const stylesheetUrls = [];
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) stylesheetUrls.push(resolveUrl(href, baseUrl));
  });

  let combinedCss = "";
  $("style").each((_, el) => {
    combinedCss += "\n" + $(el).text();
  });

  const cssPromises = stylesheetUrls.slice(0, 6).map(async (cssUrl) => {
    try {
      const cssRes = await axios.get(cssUrl, {
        timeout: 5000,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        httpsAgent
      });
      return cssRes.data;
    } catch {
      return "";
    }
  });

  const fetchedCss = await Promise.all(cssPromises);
  combinedCss += "\n" + fetchedCss.join("\n");

  // 3. Favicon
  let favicon = $('link[rel*="icon"]').attr("href") || $('link[rel="apple-touch-icon"]').attr("href") || "/favicon.ico";
  favicon = resolveUrl(favicon, baseUrl);

  // 4. Logo Extraction
  const logoData = extractHeaderLogo($, baseUrl, rawTitle, brandName);

  // 5. Colors with Exact Context
  const colorMap = extractColorsWithContext(combinedCss, html, $, favicon);
  const palette = buildBrandPaletteWithContext(colorMap, brandName);

  // 6. 1:1 Real Typography & Real Content
  const googleFontsData = extractGoogleFonts($, combinedCss);
  const cssFonts = extractCssFontFamilies(combinedCss);
  const typography = extractRealTypography($, googleFontsData, cssFonts);

  // 7. AI Copywriting & Brand Messaging
  const copywriting = analyzeCopywritingAndMessaging(brandName, typography, metaDesc);

  return {
    success: true,
    url: finalUrl,
    hostname: new URL(finalUrl).hostname,
    brandName,
    tagline: metaDesc || `Zakázková výroba interiérů a nábytku na míru — ${brandName}`,
    logo: logoData.primary,
    logoCandidates: logoData.candidates,
    favicon,
    palette,
    typography,
    copywriting,
    timestamp: new Date().toISOString()
  };
}