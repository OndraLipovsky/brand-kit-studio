import React, { useState } from "react";
import { 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Printer, 
  Sparkles, 
  MapPin, 
  Info,
  Layers 
} from "lucide-react";
import { hexToCmyk, hexToRgb, getContrastRatio } from "../../utils/colorUtils.js";

export default function ColorsTab({ brandData, setBrandData }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleColorChange = (id, newHex) => {
    if (!newHex.startsWith("#")) newHex = "#" + newHex;
    if (newHex.length > 7) return;

    const cmyk = hexToCmyk(newHex);
    const rgb = hexToRgb(newHex);
    const contrastWhite = getContrastRatio(newHex, "#ffffff");
    const contrastBlack = getContrastRatio(newHex, "#000000");

    setBrandData((prev) => ({
      ...prev,
      palette: prev.palette.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            hex: newHex,
            rgb,
            cmyk,
            contrastWhite,
            contrastBlack,
            isDark: contrastWhite > contrastBlack
          };
        }
        return c;
      })
    }));
  };

  const handleLabelChange = (id, newLabel) => {
    setBrandData((prev) => ({
      ...prev,
      palette: prev.palette.map((c) => (c.id === id ? { ...c, label: newLabel } : c))
    }));
  };

  const handleRoleChange = (id, newRole) => {
    setBrandData((prev) => ({
      ...prev,
      palette: prev.palette.map((c) => (c.id === id ? { ...c, role: newRole } : c))
    }));
  };

  const handleDeleteColor = (id) => {
    setBrandData((prev) => ({
      ...prev,
      palette: prev.palette.filter((c) => c.id !== id)
    }));
  };

  const handleAddColor = () => {
    const newHex = "#b23a48";
    const cmyk = hexToCmyk(newHex);
    const newColor = {
      id: "color-" + Math.random().toString(36).substr(2, 9),
      role: "Accent",
      label: "Custom Accent",
      hex: newHex,
      rgb: hexToRgb(newHex),
      hsl: "hsl(353, 51%, 46%)",
      cmyk,
      isDark: true,
      contrastWhite: getContrastRatio(newHex, "#ffffff"),
      contrastBlack: getContrastRatio(newHex, "#000000"),
      foundIn: "User Added Custom Swatch",
      suggestedUsage: "Highlights, buttons, secondary accents"
    };

    setBrandData((prev) => ({
      ...prev,
      palette: [...prev.palette, newColor]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-purple-950/30 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Brand Colors & Exact Usage Context</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Every color is tagged with its <strong className="text-indigo-300">exact location on the website</strong> (e.g. page background, headings, or tiny accordion divider lines) so there is zero ambiguity.
          </p>
        </div>

        <button
          onClick={handleAddColor}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Swatch</span>
        </button>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {brandData.palette.map((color) => {
          const isContrastGoodForWhite = color.contrastWhite >= 4.5;
          const isContrastGoodForBlack = color.contrastBlack >= 4.5;

          return (
            <div
              key={color.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl overflow-hidden flex flex-col transition group"
            >
              {/* Swatch Header Box */}
              <div
                className="h-36 relative p-4 flex flex-col justify-between transition-colors cursor-pointer border-b border-black/10"
                style={{ backgroundColor: color.hex }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md ${
                      color.isDark ? "bg-black/50 text-white backdrop-blur-sm" : "bg-white/80 text-slate-900 backdrop-blur-sm"
                    }`}
                  >
                    {color.role}
                  </span>

                  <div className="flex items-center space-x-1.5 opacity-80 group-hover:opacity-100 transition">
                    <input
                      type="color"
                      value={color.hex.length === 7 ? color.hex : "#000000"}
                      onChange={(e) => handleColorChange(color.id, e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                      title="Open Color Picker"
                    />
                    <button
                      onClick={() => handleDeleteColor(color.id)}
                      className={`p-1.5 rounded-md text-xs transition ${
                        color.isDark ? "bg-black/30 hover:bg-red-500 text-white" : "bg-white/50 hover:bg-red-500 text-slate-900 hover:text-white"
                      }`}
                      title="Delete Color"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div
                    className={`font-black text-2xl tracking-wider ${
                      color.isDark ? "text-white drop-shadow" : "text-slate-950"
                    }`}
                  >
                    {color.hex.toUpperCase()}
                  </div>
                  <button
                    onClick={() => copyToClipboard(color.hex, `${color.id}-hex`)}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                      color.isDark ? "bg-white/20 hover:bg-white/30 text-white" : "bg-black/20 hover:bg-black/30 text-slate-900"
                    }`}
                  >
                    {copiedId === `${color.id}-hex` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>HEX</span>
                  </button>
                </div>
              </div>

              {/* Color Details & Context */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="text"
                      value={color.label}
                      onChange={(e) => handleLabelChange(color.id, e.target.value)}
                      className="text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none w-full mr-2"
                    />
                    <select
                      value={color.role}
                      onChange={(e) => handleRoleChange(color.id, e.target.value)}
                      className="text-[10px] font-semibold bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500 shrink-0"
                    >
                      <option value="Primary Brand">Primary Brand</option>
                      <option value="Background Canvas">Background Canvas</option>
                      <option value="Dark Neutral">Dark Neutral</option>
                      <option value="Accent">Accent</option>
                      <option value="Micro Accent">Micro Accent</option>
                      <option value="Secondary Brand">Secondary Brand</option>
                    </select>
                  </div>

                  {/* Prominent Context Tag */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 text-xs mb-3 space-y-1">
                    <div className="flex items-start space-x-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium text-indigo-300">
                        {color.foundIn || "Detected in Stylesheet"}
                      </span>
                    </div>
                    {color.contextSnippet && (
                      <p className="font-mono text-[10px] text-slate-500 truncate pl-5">
                        {color.contextSnippet}
                      </p>
                    )}
                  </div>

                  {/* Specification Values */}
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
                      <span className="text-slate-400">RGB</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-200 text-[11px]">{color.rgb}</span>
                        <button
                          onClick={() => copyToClipboard(color.rgb, `${color.id}-rgb`)}
                          className="text-slate-500 hover:text-white"
                        >
                          {copiedId === `${color.id}-rgb` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-950/20 border border-indigo-900/30">
                      <span className="text-indigo-300 font-semibold">CMYK (Print)</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold text-[11px]">
                          {color.cmyk?.string || "C:0% M:0% Y:0% K:0%"}
                        </span>
                        <button
                          onClick={() => copyToClipboard(color.cmyk?.string, `${color.id}-cmyk`)}
                          className="text-indigo-400 hover:text-white"
                        >
                          {copiedId === `${color.id}-cmyk` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contrast indicator */}
                <div className="pt-3 border-t border-slate-800/60 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 mb-1.5">
                    <span>Contrast Legibility</span>
                    <span className="text-[10px] text-slate-500">WCAG 2.1</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    <div className={`p-1.5 rounded-lg border ${isContrastGoodForWhite ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                      vs White: <strong>{color.contrastWhite}:1</strong>
                    </div>
                    <div className={`p-1.5 rounded-lg border ${isContrastGoodForBlack ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                      vs Black: <strong>{color.contrastBlack}:1</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}