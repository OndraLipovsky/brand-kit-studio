import React, { useState, useEffect } from "react";
import { CheckCircle2, CircleDashed, Globe2, Palette, Type, Sparkles, Truck } from "lucide-react";

export default function AnalysisLoading() {
  const steps = [
    { label: "Connecting to server & resolving DNS...", icon: Globe2 },
    { label: "Scraping header elements, logo mark & favicon...", icon: Sparkles },
    { label: "Downloading and parsing stylesheets & inline CSS...", icon: Palette },
    { label: "Computing typography hierarchy & Google Fonts...", icon: Type },
    { label: "Calculating CMYK print values for truck & vinyl wraps...", icon: Truck },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center">
      <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">Analyzing Brand Assets</h3>
      <p className="text-xs text-slate-400 mb-6">
        Crawling DOM structure, styles, and vector graphics in real-time...
      </p>

      <div className="space-y-3 text-left">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 text-xs transition-opacity duration-300 ${
                isDone ? "text-emerald-400 opacity-90" : isCurrent ? "text-indigo-400 font-semibold" : "text-slate-600 opacity-50"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <CircleDashed className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
