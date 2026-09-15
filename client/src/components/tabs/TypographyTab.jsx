import React, { useState, useEffect } from "react";
import { Type, Edit3, Check, Copy, Sparkles, SlidersHorizontal } from "lucide-react";

export default function TypographyTab({ brandData, setBrandData }) {
  const [testString, setTestString] = useState("The quick brown fox jumps over the lazy dog");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Dynamically load Google Font if detected
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
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700;800;900&display=swap`;
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

  const cssSnippet = `/* Typography Rules for ${brandData.brandName} */
:root {
  --font-heading: '${brandData.typography.headingFont}', sans-serif;
  --font-body: '${brandData.typography.bodyFont}', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

body, p, input, button {
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
            <h2 className="text-xl font-bold text-white">Typography Hierarchy & Lettering</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Clean typographic scales ensuring optimal hierarchy on screens, promotional print, and readable lettering on commercial vehicle livery.
          </p>
        </div>

        <button
          onClick={copySnippet}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
        >
          {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Typography CSS</span>
        </button>
      </div>

      {/* Font Family Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heading Font */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Primary Heading Font
            </span>
            <span className="text-xs text-slate-500">Headers, Logos & Slogans</span>
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-400 block mb-1">Font Family Name</label>
            <input
              type="text"
              value={brandData.typography.headingFont}
              onChange={(e) => handleHeadingFontChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80">
            <div
              className="text-3xl font-extrabold text-white tracking-tight mb-2 truncate"
              style={{ fontFamily: brandData.typography.headingFont }}
            >
              {brandData.brandName} Bold Headline
            </div>
            <p
              className="text-sm text-slate-300"
              style={{ fontFamily: brandData.typography.headingFont }}
            >
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj 0123456789
            </p>
          </div>
        </div>

        {/* Body Font */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Primary Body Font
            </span>
            <span className="text-xs text-slate-500">Body, UI & Specifications</span>
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-400 block mb-1">Font Family Name</label>
            <input
              type="text"
              value={brandData.typography.bodyFont}
              onChange={(e) => handleBodyFontChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80">
            <p
              className="text-base text-slate-200 leading-relaxed mb-2"
              style={{ fontFamily: brandData.typography.bodyFont }}
            >
              Clean, highly legible text designed for effortless reading across mobile viewports, print catalogs, and fleet decals.
            </p>
            <p
              className="text-xs text-slate-400"
              style={{ fontFamily: brandData.typography.bodyFont }}
            >
              Regular 400 &bull; Medium 500 &bull; SemiBold 600
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Typography Scale Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Full Type Scale Hierarchy</h3>
            <p className="text-xs text-slate-400">
              Configure sizing, weight, and sample text for every tier of the design system.
            </p>
          </div>

          {/* Test text changer */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Test custom headline or slogan..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold">
                <th className="pb-3 w-16">Level</th>
                <th className="pb-3 w-40">Role</th>
                <th className="pb-3 w-32">Size</th>
                <th className="pb-3 w-32">Weight</th>
                <th className="pb-3">Visual Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {brandData.typography.hierarchy.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-bold font-mono text-indigo-400">
                    {item.level}
                  </td>
                  <td className="py-4 text-slate-300 font-medium">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleHierarchyChange(idx, "name", e.target.value)}
                      className="bg-transparent hover:bg-slate-800/50 rounded px-1.5 py-1 focus:outline-none focus:bg-slate-950 w-full"
                    />
                  </td>
                  <td className="py-4 text-slate-400 font-mono">
                    <input
                      type="text"
                      value={item.size}
                      onChange={(e) => handleHierarchyChange(idx, "size", e.target.value)}
                      className="bg-transparent hover:bg-slate-800/50 rounded px-1.5 py-1 focus:outline-none focus:bg-slate-950 w-full"
                    />
                  </td>
                  <td className="py-4 text-slate-400">
                    <input
                      type="text"
                      value={item.weight}
                      onChange={(e) => handleHierarchyChange(idx, "weight", e.target.value)}
                      className="bg-transparent hover:bg-slate-800/50 rounded px-1.5 py-1 focus:outline-none focus:bg-slate-950 w-full"
                    />
                  </td>
                  <td className="py-4">
                    <div
                      className="text-white truncate max-w-md"
                      style={{
                        fontFamily: item.font,
                        fontWeight: item.weight.includes("700") || item.weight.includes("Bold") ? 700 : 400
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
