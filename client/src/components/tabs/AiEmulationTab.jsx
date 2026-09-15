import React, { useState } from "react";
import { 
  Bot, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  Palette, 
  Layers 
} from "lucide-react";

export default function AiEmulationTab({ brandData }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyCode = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const primary = brandData.palette.find((c) => c.role === "Primary Brand") || brandData.palette[0];
  const secondary = brandData.palette.find((c) => c.role === "Secondary Brand") || brandData.palette[1] || primary;
  const accent = brandData.palette.find((c) => c.role === "Accent") || brandData.palette[2] || primary;
  const dark = brandData.palette.find((c) => c.role === "Dark Neutral") || { hex: "#0f172a" };
  const light = brandData.palette.find((c) => c.role === "Light Neutral") || { hex: "#ffffff" };

  // 1. Master AI Emulation Prompt for LLMs / Antigravity
  const aiEmulationPrompt = `You are a Principal Frontend Designer and Engineer. Replicate and emulate the visual design identity of "${brandData.brandName}" (${brandData.hostname}) with absolute pixel fidelity.

DESIGN TOKENS & SYSTEM SPECIFICATIONS:
- Primary Brand Color: ${primary.hex} (RGB: ${primary.rgb} | CMYK: ${primary.cmyk?.string})
- Secondary Color: ${secondary.hex}
- Accent / Highlight: ${accent.hex}
- Dark Surface & Typography: ${dark.hex}
- Light Neutral Surface: ${light.hex}

TYPOGRAPHY:
- Heading Font Family: "${brandData.typography.headingFont}", sans-serif
- Body Font Family: "${brandData.typography.bodyFont}", sans-serif
- Tone: Modern, polished, high-contrast, premium aesthetic.

ICON SYSTEM:
- Framework: ${brandData.icons.map((i) => i.name).join(", ") || "Lucide Icons / Clean SVG vector icons"}

TECHNICAL STACK IN USE:
- CSS Engine: ${brandData.tech.join(", ") || "Tailwind CSS"}

INSTRUCTIONS:
1. When generating web components or user interfaces, strictly use the primary color (${primary.hex}) for primary CTAs, active indicators, and prominent logo elements.
2. Use the font "${brandData.typography.headingFont}" for all titles, with bold weights (700/800) and tight tracking (-0.02em).
3. Ensure high visual contrast adhering to WCAG 2.1 AAA.`;

  // 2. Matching Logo Generator Prompt
  const logoGenPrompt = `Minimalist modern vector logo for "${brandData.brandName}", premium corporate identity, vector flat design, utilizing the exact brand color palette: primary ${primary.hex}, secondary ${secondary.hex}, and accent ${accent.hex}. Clean geometry, iconic symbol, white background, no gradients, vector art, SVG style.`;

  // 3. Tailwind CSS Theme Config
  const tailwindConfigSnippet = `// tailwind.config.js snippet for ${brandData.brandName}
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${primary.hex}',
          secondary: '${secondary.hex}',
          accent: '${accent.hex}',
          dark: '${dark.hex}',
          light: '${light.hex}',
        },
      },
      fontFamily: {
        heading: ['"${brandData.typography.headingFont}"', 'sans-serif'],
        body: ['"${brandData.typography.bodyFont}"', 'sans-serif'],
      },
    },
  },
};`;

  // 4. CSS Custom Properties
  const cssVariablesSnippet = `/* CSS Variables for ${brandData.brandName} */
:root {
  --color-primary: ${primary.hex};
  --color-secondary: ${secondary.hex};
  --color-accent: ${accent.hex};
  --color-dark: ${dark.hex};
  --color-light: ${light.hex};
  
  --font-heading: '${brandData.typography.headingFont}', sans-serif;
  --font-body: '${brandData.typography.bodyFont}', sans-serif;

  /* Print / CMYK References */
  --cmyk-primary: ${primary.cmyk?.string || "C:0% M:0% Y:0% K:0%"};
}`;

  // 5. Design Tokens JSON
  const tokensJson = JSON.stringify(
    {
      brand: brandData.brandName,
      sourceUrl: brandData.url,
      colors: brandData.palette.map((c) => ({
        role: c.role,
        label: c.label,
        hex: c.hex,
        rgb: c.rgb,
        cmyk: c.cmyk?.string
      })),
      typography: {
        heading: brandData.typography.headingFont,
        body: brandData.typography.bodyFont,
        hierarchy: brandData.typography.hierarchy.map((h) => ({
          level: h.level,
          size: h.size,
          weight: h.weight
        }))
      },
      techStack: brandData.tech,
      icons: brandData.icons.map((i) => i.name)
    },
    null,
    2
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-purple-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">AI Emulation & Design Tokens</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Plug these pre-engineered tokens and prompts into ChatGPT, Claude, Gemini, or Antigravity to emulate or generate matching graphics in seconds.
          </p>
        </div>
      </div>

      {/* AI Prompts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Master Emulation Prompt */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">
                  Full Website Emulation Prompt
                </h3>
              </div>
              <button
                onClick={() => copyCode(aiEmulationPrompt, "master-prompt")}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
              >
                {copiedKey === "master-prompt" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Prompt</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Paste this into an AI model to instruct it to build components with this exact brand identity.
            </p>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-56">
              {aiEmulationPrompt}
            </pre>
          </div>
        </div>

        {/* Matching Logo Prompt */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-pink-400" />
                <h3 className="font-bold text-white text-sm">
                  Matching Logo Generation Prompt
                </h3>
              </div>
              <button
                onClick={() => copyCode(logoGenPrompt, "logo-prompt")}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
              >
                {copiedKey === "logo-prompt" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Prompt</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Use with Midjourney, DALL-E 3, or Antigravity's generate_image tool to produce brand-matching logos.
            </p>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap max-h-56">
              {logoGenPrompt}
            </pre>
          </div>
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tailwind Config */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white text-xs">Tailwind CSS Config</h4>
              </div>
              <button
                onClick={() => copyCode(tailwindConfigSnippet, "tailwind")}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy snippet"
              >
                {copiedKey === "tailwind" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-48">
              {tailwindConfigSnippet}
            </pre>
          </div>
        </div>

        {/* CSS Custom Properties */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h4 className="font-bold text-white text-xs">CSS Variables (:root)</h4>
              </div>
              <button
                onClick={() => copyCode(cssVariablesSnippet, "css-vars")}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy snippet"
              >
                {copiedKey === "css-vars" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 overflow-x-auto max-h-48">
              {cssVariablesSnippet}
            </pre>
          </div>
        </div>

        {/* JSON Tokens */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white text-xs">Design Tokens JSON</h4>
              </div>
              <button
                onClick={() => copyCode(tokensJson, "tokens-json")}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Copy snippet"
              >
                {copiedKey === "tokens-json" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto max-h-48">
              {tokensJson}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
