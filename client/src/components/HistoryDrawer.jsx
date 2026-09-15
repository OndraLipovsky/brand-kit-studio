import React, { useState } from "react";
import { 
  History, 
  X, 
  Trash2, 
  ExternalLink, 
  ArrowRight, 
  Search, 
  Clock, 
  Sparkles 
} from "lucide-react";
import { deleteBrandFromHistory, clearBrandHistory } from "../utils/historyStorage.js";

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  setHistory,
  onSelectBrand
}) {
  const [filter, setFilter] = useState("");

  if (!isOpen) return null;

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updated = deleteBrandFromHistory(id);
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all saved brand entries?")) {
      clearBrandHistory();
      setHistory([]);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.brandName.toLowerCase().includes(filter.toLowerCase()) ||
    item.hostname.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <History className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Analysis History</h3>
              <p className="text-xs text-slate-400">
                {history.length} saved {history.length === 1 ? "website" : "websites"}
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

        {/* Search & Actions */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search saved brands..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition border border-red-900/30"
              title="Clear all history"
            >
              Clear
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No saved brand entries found.</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Websites you analyze will be automatically saved here.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectBrand(item.fullData);
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 transition cursor-pointer group flex items-start justify-between gap-3 shadow-sm hover:shadow-indigo-950/20"
              >
                <div className="flex items-start space-x-3 min-w-0">
                  {/* Swatch indicator */}
                  <div
                    className="w-9 h-9 rounded-lg border border-white/20 shrink-0 flex items-center justify-center text-xs font-bold shadow"
                    style={{ backgroundColor: item.primaryColor }}
                  >
                    <span className="text-[10px] text-white/80 drop-shadow">
                      {item.brandName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate group-hover:text-indigo-400 transition">
                      {item.brandName}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.hostname}
                    </p>
                    <div className="flex items-center space-x-2 mt-1.5 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(item.savedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                      {item.headingFont && (
                        <>
                          <span>&bull;</span>
                          <span className="truncate">{item.headingFont}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                    title="Delete saved entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="p-1.5 text-indigo-400 group-hover:translate-x-0.5 transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}