import React, { useState } from "react";
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Check, 
  ExternalLink, 
  Eye, 
  Layers, 
  Sparkles, 
  Wrench,
  FileCode,
  Edit3,
  Truck
} from "lucide-react";

export default function OverviewTab({ brandData, setBrandData, onOpenFleetModal }) {
  const [logoBg, setLogoBg] = useState("dark"); // "dark" | "light" | "grid"
  const [showCandidatePicker, setShowCandidatePicker] = useState(false);
  const [isEditingBrandInfo, setIsEditingBrandInfo] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setBrandData((prev) => ({
            ...prev,
            logo: {
              ...prev.logo,
              type: file.type.includes("svg") ? "svg" : "image",
              src: result,
              alt: file.name
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectCandidate = (cand) => {
    setBrandData((prev) => ({
      ...prev,
      logo: cand
    }));
    setShowCandidatePicker(false);
  };

  const handleDownloadLogo = () => {
    if (brandData.logo.type === "svg" && brandData.logo.svgContent) {
      const blob = new Blob([brandData.logo.svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${brandData.brandName.toLowerCase()}-logo.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (brandData.logo.src) {
      const a = document.createElement("a");
      a.href = brandData.logo.src;
      a.download = `${brandData.brandName.toLowerCase()}-logo`;
      a.target = "_blank";
      a.click();
    }
  };

  return (
    <div className="space-y-8">
      {/* Brand Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {brandData.brandName}
            </h2>
            <button
              onClick={() => setIsEditingBrandInfo(!isEditingBrandInfo)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition"
              title="Edit Brand Name & Slogan"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <a
              href={brandData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>{brandData.hostname}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {isEditingBrandInfo ? (
            <div className="space-y-3 my-3 p-4 rounded-xl bg-slate-950 border border-indigo-500/40">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandData.brandName}
                  onChange={(e) => setBrandData(prev => ({ ...prev, brandName: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Tagline / Mission</label>
                <textarea
                  value={brandData.tagline}
                  onChange={(e) => setBrandData(prev => ({ ...prev, tagline: e.target.value }))}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => setIsEditingBrandInfo(false)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              {brandData.tagline || "No description found. Click edit to add a brand slogan or tagline."}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-500 block">Colors Analyzed</span>
            <span className="text-lg font-bold text-white">{brandData.palette.length} Swatches</span>
          </div>
          <div className="w-px h-10 bg-slate-800 hidden sm:block" />
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-500 block">Primary Typeface</span>
            <span className="text-lg font-bold text-indigo-400">{brandData.typography.headingFont}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Logo Card + Favicon & Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Header Logo (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-white">Header Logo / Wordmark</h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-800 text-slate-300 uppercase">
                  {brandData.logo.type}
                </span>
              </div>

              {/* Background preview controls */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setLogoBg("dark")}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                    logoBg === "dark" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setLogoBg("light")}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                    logoBg === "light" ? "bg-white text-slate-900 shadow font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setLogoBg("grid")}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                    logoBg === "grid" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>

            {/* Logo Display Canvas */}
            <div
              className={`w-full min-h-[220px] sm:min-h-[260px] rounded-xl flex items-center justify-center p-8 transition-colors duration-300 relative border ${
                logoBg === "light"
                  ? "bg-slate-50 border-slate-200 text-slate-950"
                  : logoBg === "grid"
                  ? "bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 border-slate-800 text-white"
                  : "bg-slate-950 border-slate-800 text-white"
              }`}
            >
              {brandData.logo.type === "text" ? (
                <div className="text-center flex flex-col items-center">
                  <span
                    className="text-4xl sm:text-5xl font-black tracking-tight leading-none"
                    style={{
                      fontFamily: brandData.typography.headingFont,
                      color: logoBg === "light" ? "#1e242b" : "#ffffff"
                    }}
                  >
                    {brandData.logo.textWordmark}
                  </span>
                  {brandData.logo.subtitleWordmark && (
                    <span
                      className={`text-xs uppercase tracking-[0.28em] font-semibold mt-2.5 ${
                        logoBg === "light" ? "text-slate-600" : "text-slate-400"
                      }`}
                      style={{ fontFamily: brandData.typography.bodyFont }}
                    >
                      {brandData.logo.subtitleWordmark}
                    </span>
                  )}
                  <p className="mt-3 text-[11px] opacity-60">
                    Extracted from website header navigation
                  </p>
                </div>
              ) : brandData.logo.type === "svg" ? (
                <div
                  className="max-h-32 max-w-xs flex items-center justify-center [&>svg]:max-h-24 [&>svg]:w-auto [&>svg]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: brandData.logo.svgContent }}
                />
              ) : (
                <img
                  src={brandData.logo.src}
                  alt={brandData.logo.alt || brandData.brandName}
                  className="max-h-28 max-w-full object-contain filter drop-shadow-md"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.src = `/api/proxy-image?url=${encodeURIComponent(brandData.logo.src)}`;
                  }}
                />
              )}
            </div>

            {/* Editable Wordmark inputs if text logo */}
            {brandData.logo.type === "text" && isEditingLogo && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Primary Wordmark</label>
                    <input
                      type="text"
                      value={brandData.logo.textWordmark}
                      onChange={(e) => setBrandData(prev => ({
                        ...prev,
                        logo: { ...prev.logo, textWordmark: e.target.value }
                      }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Subtitle / Descriptor</label>
                    <input
                      type="text"
                      value={brandData.logo.subtitleWordmark || ""}
                      onChange={(e) => setBrandData(prev => ({
                        ...prev,
                        logo: { ...prev.logo, subtitleWordmark: e.target.value }
                      }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logo Actions */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              {brandData.logo.type === "text" && (
                <button
                  onClick={() => setIsEditingLogo(!isEditingLogo)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isEditingLogo ? "Done" : "Edit Wordmark"}</span>
                </button>
              )}

              <button
                onClick={handleDownloadLogo}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Save Asset</span>
              </button>

              <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Replacement</span>
                <input
                  type="file"
                  accept="image/*,.svg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {brandData.logoCandidates && brandData.logoCandidates.length > 1 && (
              <button
                onClick={() => setShowCandidatePicker(!showCandidatePicker)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                {showCandidatePicker ? "Hide candidates" : `View ${brandData.logoCandidates.length} detected alternatives`}
              </button>
            )}
          </div>

          {/* Candidate selector drawer */}
          {showCandidatePicker && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <p className="text-xs font-semibold text-slate-400 mb-3">
                Select another logo or graphic found on the website:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {brandData.logoCandidates.map((cand, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCandidate(cand)}
                    className="p-3 rounded-lg border border-slate-800 hover:border-indigo-500 bg-slate-900 text-left transition flex flex-col items-center justify-center text-center space-y-2 group"
                  >
                    {cand.type === "text" ? (
                      <div className="truncate w-full">
                        <span className="font-bold text-sm text-white block truncate">
                          "{cand.textWordmark}"
                        </span>
                        {cand.subtitleWordmark && (
                          <span className="text-[10px] text-slate-400 block truncate">
                            {cand.subtitleWordmark}
                          </span>
                        )}
                      </div>
                    ) : cand.type === "svg" ? (
                      <div
                        className="h-8 flex items-center justify-center [&>svg]:h-7 [&>svg]:w-auto"
                        dangerouslySetInnerHTML={{ __html: cand.svgContent }}
                      />
                    ) : (
                      <img
                        src={cand.src}
                        alt="alt"
                        className="h-8 max-w-full object-contain"
                        crossOrigin="anonymous"
                      />
                    )}
                    <span className="text-[10px] text-slate-500 group-hover:text-indigo-400 uppercase font-semibold">
                      {cand.type} (Score {cand.score})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Favicon & Side Panel */}
        <div className="space-y-6">
          {/* Favicon Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white">Favicon & App Icon</h3>
              </div>
              {brandData.favicon && (
                <a
                  href={brandData.favicon}
                  download="favicon"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Download
                </a>
              )}
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shrink-0">
                {brandData.favicon ? (
                  <img
                    src={brandData.favicon}
                    alt="Favicon"
                    className="w-10 h-10 object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.src = `/api/proxy-image?url=${encodeURIComponent(brandData.favicon)}`;
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-slate-800" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  {brandData.favicon ? brandData.favicon.split("/").pop() : "No favicon detected"}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Used for browser tabs, bookmarks & mobile home screens
                </span>
              </div>
            </div>
          </div>

          {/* Optional Commercial Vehicle Wrap Callout */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Truck className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">Vehicle & Fleet Livery</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                Optional
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need commercial prints for trucks, vans, or physical signage matching this exact website?
            </p>
            <button
              onClick={onOpenFleetModal}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 transition flex items-center justify-center space-x-2 border border-emerald-900/30"
            >
              <Truck className="w-4 h-4" />
              <span>Open Vehicle Wrap & CMYK Specifier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}