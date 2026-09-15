import React from "react";
import { Sparkles, FileDown, Bot, ExternalLink } from "lucide-react";

export default function Navbar({ onOpenAntigravityGuide, onExportPdf, hasData, brandName }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                BrandKit Studio
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Website Analyzer &bull; Print & Truck Specs &bull; AI Emulation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAntigravityGuide}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition shadow-sm"
            title="Learn how to run brand analysis with Antigravity Agent for $0 API cost"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Antigravity Agent API</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
              $0 Cost
            </span>
          </button>

          {hasData && (
            <button
              onClick={onExportPdf}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              <FileDown className="w-4 h-4" />
              <span>Export Brand Kit PDF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
