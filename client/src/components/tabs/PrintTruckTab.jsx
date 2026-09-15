import React, { useState } from "react";
import { 
  Truck, 
  Printer, 
  ShieldCheck, 
  Maximize2, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileSpreadsheet 
} from "lucide-react";

export default function PrintTruckTab({ brandData }) {
  const [vehicleColor, setVehicleColor] = useState("white"); // "white" | "black" | "silver"
  const [copiedIndex, setCopiedIndex] = useState(null);

  const primary = brandData.palette.find((c) => c.role === "Primary Brand") || brandData.palette[0];
  const secondary = brandData.palette.find((c) => c.role === "Secondary Brand") || brandData.palette[1] || primary;
  const accent = brandData.palette.find((c) => c.role === "Accent") || brandData.palette[2] || primary;
  const dark = brandData.palette.find((c) => c.role === "Dark Neutral") || { hex: "#0f172a" };
  const light = brandData.palette.find((c) => c.role === "Light Neutral") || { hex: "#ffffff" };

  const copyCmyk = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Commercial Truck & Livery Print Spec</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Direct calibration for vehicle wraps, delivery vans, vinyl plotters, and promotional signage matching the exact web identity.
          </p>
        </div>

        {/* Vehicle paint selector */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium px-2">Vehicle Base:</span>
          <button
            onClick={() => setVehicleColor("white")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
              vehicleColor === "white" ? "bg-white text-slate-900 font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            White Fleet
          </button>
          <button
            onClick={() => setVehicleColor("silver")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
              vehicleColor === "silver" ? "bg-slate-300 text-slate-900 font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Silver Metallic
          </button>
          <button
            onClick={() => setVehicleColor("black")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
              vehicleColor === "black" ? "bg-slate-800 text-white font-bold shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Black Fleet
          </button>
        </div>
      </div>

      {/* Interactive Vehicle Livery Mockup */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              Simulated Commercial Truck / Van Livery
            </h3>
          </div>
          <span className="text-xs text-slate-400">Scale Preview</span>
        </div>

        {/* Truck Canvas Mockup */}
        <div
          className={`w-full rounded-2xl p-6 sm:p-10 border transition-colors duration-300 relative overflow-hidden flex flex-col justify-between min-h-[260px] ${
            vehicleColor === "white"
              ? "bg-slate-100 border-slate-300 text-slate-900"
              : vehicleColor === "silver"
              ? "bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 border-slate-400 text-slate-900"
              : "bg-slate-950 border-slate-800 text-white"
          }`}
        >
          {/* Van Top Accent Stripe */}
          <div
            className="h-3 sm:h-4 w-full rounded-full shadow-sm"
            style={{ backgroundColor: primary.hex }}
          />

          {/* Van Body Center Content */}
          <div className="my-8 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            {/* Logo Mark Area */}
            <div className="flex items-center space-x-4">
              <div
                className="p-4 rounded-xl shadow-lg border"
                style={{
                  backgroundColor: vehicleColor === "black" ? "#000000" : "#ffffff",
                  borderColor: primary.hex
                }}
              >
                {brandData.logo.type === "svg" ? (
                  <div
                    className="h-14 max-w-[180px] flex items-center justify-center [&>svg]:h-12 [&>svg]:w-auto"
                    dangerouslySetInnerHTML={{ __html: brandData.logo.svgContent }}
                  />
                ) : brandData.logo.type === "image" ? (
                  <img
                    src={brandData.logo.src}
                    alt={brandData.brandName}
                    className="h-14 max-w-[180px] object-contain"
                  />
                ) : (
                  <span
                    className="text-2xl font-black tracking-tight"
                    style={{
                      fontFamily: brandData.typography.headingFont,
                      color: vehicleColor === "black" ? "#ffffff" : primary.hex
                    }}
                  >
                    {brandData.logo.textWordmark}
                  </span>
                )}
              </div>

              <div>
                <h4
                  className="text-2xl sm:text-3xl font-black tracking-tight uppercase"
                  style={{
                    fontFamily: brandData.typography.headingFont,
                    color: vehicleColor === "black" ? "#ffffff" : "#0f172a"
                  }}
                >
                  {brandData.brandName}
                </h4>
                <p
                  className="text-xs sm:text-sm font-semibold opacity-75 uppercase tracking-wider"
                  style={{ fontFamily: brandData.typography.bodyFont }}
                >
                  {brandData.tagline?.slice(0, 50) || "Official Commercial Fleet"}
                </p>
              </div>
            </div>

            {/* High-visibility Contact Badge */}
            <div className="text-right">
              <div
                className="px-4 py-2 rounded-xl font-mono font-bold text-sm sm:text-base shadow-md inline-block"
                style={{
                  backgroundColor: accent.hex,
                  color: accent.isDark ? "#ffffff" : "#000000"
                }}
              >
                ?? 1-800-BRAND-KIT
              </div>
              <div
                className="text-xs font-mono font-bold mt-1.5 opacity-80"
                style={{ color: vehicleColor === "black" ? "#ffffff" : "#0f172a" }}
              >
                ?? {brandData.hostname}
              </div>
            </div>
          </div>

          {/* Bottom Vehicle Wrap Stripe */}
          <div className="flex items-center space-x-2">
            <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: secondary.hex }} />
            <div className="h-2 w-12 rounded-full" style={{ backgroundColor: accent.hex }} />
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-3 text-center">
          * Simulated livery demonstration showing primary vinyl stripe, high-contrast logo placement, and contact badge.
        </p>
      </div>

      {/* CMYK Print Shop Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">
              CMYK & Vinyl Plotter Specifications Table
            </h3>
          </div>
          <span className="text-xs text-slate-400">Pass this table directly to your printer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold">
                <th className="pb-3 w-16">Swatch</th>
                <th className="pb-3 w-36">Brand Role</th>
                <th className="pb-3 w-28">HEX Code</th>
                <th className="pb-3 w-40">RGB (Screens)</th>
                <th className="pb-3 w-44">CMYK (Print/Wrap)</th>
                <th className="pb-3">Recommended Livery Application</th>
                <th className="pb-3 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {brandData.palette.map((color, idx) => (
                <tr key={color.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3">
                    <div
                      className="w-8 h-8 rounded-lg border border-white/20 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                  </td>
                  <td className="py-3 font-semibold text-white">
                    {color.label || color.role}
                  </td>
                  <td className="py-3 font-mono text-slate-300 font-bold">
                    {color.hex.toUpperCase()}
                  </td>
                  <td className="py-3 font-mono text-slate-400 text-[11px]">
                    {color.rgb}
                  </td>
                  <td className="py-3 font-mono font-bold text-indigo-300 text-[11px]">
                    {color.cmyk?.string || "C:0% M:0% Y:0% K:0%"}
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {color.suggestedUsage}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => copyCmyk(`${color.label}: HEX ${color.hex} | CMYK: ${color.cmyk?.string}`, idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                      title="Copy Full Spec"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practical Print & Signage Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <Maximize2 className="w-4 h-4" />
            <h4>Lettering Height & Distance</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rule of thumb for road visibility: <strong>1 inch of letter height per 10 feet of distance</strong>.
          </p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4 pt-1">
            <li><strong>3.5" (9 cm)</strong>: readable at 35 ft (City traffic / stoplights)</li>
            <li><strong>7.0" (18 cm)</strong>: readable at 70 ft (30-45 mph roads)</li>
            <li><strong>12.0"+ (30 cm)</strong>: readable at 120+ ft (Highway speeds)</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <h4>Recommended Vinyl Material</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Never use calendered vinyl for full vehicle contours. Specify:
          </p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4 pt-1">
            <li><strong>3M 1080 / 2080 Cast Wrap Film</strong> or <strong>Avery MPI 1105</strong></li>
            <li>Cast UV-protective gloss or matte overlaminate</li>
            <li>7-year outdoor durability rating against sun fading & road grit</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center space-x-2 text-pink-400 font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            <h4>Logo Clearspace & Seams</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Keep logos at least <strong>4 inches away from door handles</strong>, gas flaps, sliding door tracks, and panel seams to prevent distorted graphics.
          </p>
          <p className="text-xs text-slate-400 pt-1">
            High-contrast contact badges (phone/URL) should always be placed on rear doors and driver-side panels.
          </p>
        </div>
      </div>
    </div>
  );
}
