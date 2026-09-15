import React, { useState, useEffect } from "react";
import { Type, Check, Copy, Sparkles, BookOpen, Layers, Info } from "lucide-react";

export default function TypographyTab({ brandData, setBrandData }) {
  const [testString, setTestString] = useState("");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Dynamically inject Google Fonts
  useEffect(() => {
    const fontsToLoad = [brandData.typography.headingFont, brandData.typography.bodyFont]
      .filter(Boolean)
      .map((f) => f.split(",")[0].trim().replace(/['"]/g, ""));

    fontsToLoad.forEach((font) => {
      const linkId = `google-font-${font.replace(/\s+/g, "-")}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
        document.head.appendChild(link);
      }
    });
  }, [brandData.typography.headingFont, brandData.typography.bodyFont]);

  const handleHeadingFontChange = (font) => {
    setBrandData((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        headingFont: font,
        hierarchy: prev.typography.hierarchy.map((h) =>
          h.level.startsWith("H") ? { ...h, font } : h
        )
      }
    }));
  };

  const handleBodyFontChange = (font) => {
    setBrandData((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        bodyFont: font,
        hierarchy: prev.typography.hierarchy.map((h) =>
          !h.level.startsWith("H") ? { ...h, font } : h
        )
      }
    }));
  };

  const handleHierarchyChange = (index, field, value) => {
    setBrandData((prev) => {
      const newHierarchy = [...prev.typography.hierarchy];
      newHierarchy[index] = { ...newHierarchy[index], [field]: value };
      return {
        ...prev,
        typography: {
          ...prev.typography,
          hierarchy: newHierarchy
        }
      };
    });
  };

  const cssSnippet = `/* 1:1 Typography Rules for ${brandData.brandName} */
:root {
  --font-heading: '${brandData.typography.headingFont}', serif;
  --font-body: '${brandData.typography.bodyFont}', sans-serif;
}

h1, h2, h3, h4, .font-serif {
  font-family: var(--font-heading);
}

body, p, input, button, nav {
  font-family: var(--font-body);
}`;

  const copySnippet = () => {
    navigator.clipboard.writeText(cssSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Type className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">1:1 Website Typography & Content Hierarchy</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real headings, real body copy, and real font families extracted directly from <strong className="text-indigo-300">{brandData.hostname}</strong>.
          </p>
        </div>

        <button
          onClick={copySnippet}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition shrink-0"
        >
          {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Typography CSS</span>
        </button>
      </div>

      {/* Font Family Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heading Font Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Primary Headline Font
            </span>
            <span className="text-xs text-slate-500">Editorial & Titles</span>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Font Family</label>
            <input
              type="text"
              value={brandData.typography.headingFont}
              onChange={(e) => handleHeadingFontChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Real H1 Rendered */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Actual H1 From Website
            </span>
            <h3
              className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight"
              style={{ fontFamily: brandData.typography.headingFont }}
            >
              "{brandData.typography.hierarchy?.[0]?.sampleText}"
            </h3>
            <p className="text-xs text-slate-400 pt-1">
              Weights: 400 Regular &bull; Italic
            </p>
          </div>
        </div>

        {/* Body Font Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Primary Body Font
            </span>
            <span className="text-xs text-slate-500">Navigation, Body & Specs</span>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Font Family</label>
            <input
              type="text"
              value={brandData.typography.bodyFont}
              onChange={(e) => handleBodyFontChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Real Body Paragraph Rendered */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Actual Body Copy From Website
            </span>
            <p
              className="text-sm sm:text-base text-slate-200 leading-relaxed"
              style={{ fontFamily: brandData.typography.bodyFont }}
            >
              "{brandData.typography.hierarchy?.find(h => h.level === "Body")?.sampleText}"
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Weights: 300 Light &bull; 400 Regular &bull; 500 Medium &bull; 600 SemiBold
            </p>
          </div>
        </div>
      </div>

      {/* Typographic Personality Insight */}
      <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-800/30 flex items-start space-x-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white block mb-0.5 font-semibold">Typographic Rationale & Pairing Analysis:</strong>
          The pairing of <strong className="text-indigo-300">{brandData.typography.headingFont}</strong> (an editorial high-contrast serif) with <strong className="text-purple-300">{brandData.typography.bodyFont}</strong> (a neutral, legible grotesque sans-serif) communicates authentic craftsmanship, bespoke luxury, and architectural precision. The serif establishes heritage and timelessness, while the clean sans-serif ensures effortless readability for technical interior dimensions and navigation.
        </div>
      </div>

      {/* Real Hierarchy Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Actual Website Type Scale</h3>
            <p className="text-xs text-slate-400">
              Live preview showing the real elements scraped from the website.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Type custom text to test with brand font..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold">
                <th className="pb-3 w-16">Tag</th>
                <th className="pb-3 w-44">Element Role</th>
                <th className="pb-3 w-36">Font Family</th>
                <th className="pb-3 w-36">Size & Weight</th>
                <th className="pb-3">Live Content From Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {brandData.typography.hierarchy.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-bold font-mono text-indigo-400">
                    {item.level}
                  </td>
                  <td className="py-4 text-slate-300 font-medium">
                    {item.name}
                  </td>
                  <td className="py-4 font-semibold text-slate-200">
                    {item.font}
                  </td>
                  <td className="py-4 text-slate-400 text-[11px]">
                    <div>{item.size}</div>
                    <div className="text-slate-500">{item.weight}</div>
                  </td>
                  <td className="py-4">
                    <div
                      className="text-white max-w-xl text-sm"
                      style={{
                        fontFamily: item.font,
                        fontWeight: item.weight.includes("700") ? 700 : (item.weight.includes("600") ? 600 : 400)
                      }}
                    >
                      {testString || item.sampleText}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}