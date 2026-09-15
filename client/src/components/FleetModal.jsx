import React, { useState } from "react";
import { 
  X, 
  Truck, 
  Printer, 
  Maximize2, 
  ShieldCheck, 
  AlertCircle, 
  Copy, 
  Check 
} from "lucide-react";

export default function FleetModal({ brandData, onClose }) {
  const [vehicleColor, setVehicleColor] = useState("white");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const primary = brandData.palette.find((c) => c.role === "Primary Brand") || brandData.palette[0];
  const dark = brandData.palette.find((c) => c.role.includes("Dark") || c.role === "Primary Brand") || { hex: "#2b241c" };
  const accent = brandData.palette.find((c) => c.role.includes("Accent")) || primary;

  const copyCmyk = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Truck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Commercial Vehicle & Fleet Livery Spec</h3>
              <p className="text-xs text-slate-400">
                Print shop CMYK percentages, vinyl film specs & vehicle door lettering rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Simulated Livery Canvas */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white">Livery Simulation</span>
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setVehicleColor("white")}
                  className={`px-2.5 py-1 text-xs rounded font-medium ${
                    vehicleColor === "white" ? "bg-white text-slate-950 font-bold" : "text-slate-400"
                  }`}
                >
                  White
                </button>
                <button
                  onClick={() => setVehicleColor("black")}
                  className={`px-2.5 py-1 text-xs rounded font-medium ${
                    vehicleColor === "black" ? "bg-slate-800 text-white font-bold" : "text-slate-400"
                  }`}
                >
                  Black
                </button>
              </div>
            </div>

            <div
              className={`w-full rounded-xl p-8 border min-h-[180px] flex flex-col justify-between transition-colors ${
                vehicleColor === "white" ? "bg-slate-100 border-slate-300 text-slate-950" : "bg-slate-950 border-slate-800 text-white"
              }`}
            >
              <div className="h-3 w-full rounded-full" style={{ backgroundColor: primary.hex }} />

              <div className="my-6 flex items-center justify-between">
                <div>
                  <h4
                    className="text-3xl font-black tracking-tight"
                    style={{
                      fontFamily: brandData.typography.headingFont,
                      color: vehicleColor === "black" ? "#ffffff" : dark.hex
                    }}
                  >
                    {brandData.logo.textWordmark || brandData.brandName}
                  </h4>
                  {brandData.logo.subtitleWordmark && (
                    <p className="text-xs uppercase tracking-[0.25em] font-semibold opacity-75">
                      {brandData.logo.subtitleWordmark}
                    </p>
                  )}
                </div>

                <div
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold shadow"
                  style={{
                    backgroundColor: primary.hex,
                    color: primary.isDark ? "#ffffff" : "#000000"
                  }}
                >
                  🌐 {brandData.hostname}
                </div>
              </div>

              <div className="h-1.5 w-1/3 rounded-full" style={{ backgroundColor: accent.hex }} />
            </div>
          </div>

          {/* CMYK Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2 w-12">Swatch</th>
                  <th className="pb-2 w-32">Role</th>
                  <th className="pb-2 w-24">HEX</th>
                  <th className="pb-2 w-36">RGB</th>
                  <th className="pb-2 w-44">CMYK (Print)</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {brandData.palette.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-2.5">
                      <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: c.hex }} />
                    </td>
                    <td className="py-2.5 font-bold text-white">{c.label || c.role}</td>
                    <td className="py-2.5 font-mono text-slate-300">{c.hex}</td>
                    <td className="py-2.5 font-mono text-slate-400">{c.rgb}</td>
                    <td className="py-2.5 font-mono font-bold text-indigo-300">{c.cmyk?.string}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => copyCmyk(`${c.label}: HEX ${c.hex} | CMYK: ${c.cmyk?.string}`, i)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                      >
                        {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Speed & Distance Sizing:</span>
              <p className="text-slate-400">
                3.5" (9 cm) for city traffic (35 ft away). 7.0"+ (18 cm) for highway driving speeds.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Cast Vinyl Materials:</span>
              <p className="text-slate-400">
                Specify 3M 1080/2080 or Avery MPI 1105 cast wrap film with UV gloss/matte overlaminate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}