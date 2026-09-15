import React from "react";
import { Search, Globe, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function UrlInputBar({
  url,
  setUrl,
  onAnalyze,
  isLoading,
  error
}) {
  const samplePresets = [
    { label: "tskontrast.cz", url: "https://tskontrast.cz" },
    { label: "Stripe", url: "https://stripe.com" },
    { label: "Linear", url: "https://linear.app" },
    { label: "Vercel", url: "https://vercel.com" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <div className="text-center mb-5">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
          Intelligent Website{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Brand Kit & Copy Analyzer
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Scrape header logos, 1:1 real website fonts, exact color contexts, and AI copywriting analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-slate-900/90 border-2 border-slate-700/80 hover:border-indigo-500/50 focus-within:border-indigo-500 rounded-2xl p-2 shadow-2xl shadow-indigo-950/20 transition-all duration-300">
          <div className="pl-3 pr-2 text-slate-400">
            <Globe className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g. https://tskontrast.cz or stripe.com)..."
            className="w-full bg-transparent border-0 text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-sm sm:text-base px-2 py-2 font-medium"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-md active:scale-95 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze Brand</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick samples */}
      <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-400">
        <span className="font-medium text-slate-500">Quick Test:</span>
        {samplePresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              setUrl(preset.url);
              onAnalyze(preset.url);
            }}
            disabled={isLoading}
            className={`px-2.5 py-1 rounded-md border transition text-xs ${
              preset.label === "tskontrast.cz"
                ? "bg-indigo-950/40 border-indigo-700 text-indigo-300 font-semibold"
                : "bg-slate-900/80 border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs sm:text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Analysis Failed</p>
            <p className="mt-0.5 text-red-400/90">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}