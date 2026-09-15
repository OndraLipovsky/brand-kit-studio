import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import UrlInputBar from "./components/UrlInputBar.jsx";
import AnalysisLoading from "./components/AnalysisLoading.jsx";
import OverviewTab from "./components/tabs/OverviewTab.jsx";
import ColorsTab from "./components/tabs/ColorsTab.jsx";
import TypographyTab from "./components/tabs/TypographyTab.jsx";
import PrintTruckTab from "./components/tabs/PrintTruckTab.jsx";
import AiEmulationTab from "./components/tabs/AiEmulationTab.jsx";
import PdfExportModal from "./components/PdfExportModal.jsx";
import AntigravityGuideModal from "./components/AntigravityGuideModal.jsx";
import { 
  Sparkles, 
  Palette, 
  Type, 
  Truck, 
  Bot, 
  FileDown 
} from "lucide-react";

// Default starter brand kit (allows immediate preview)
const initialDemoData = {
  url: "https://stripe.com",
  hostname: "stripe.com",
  brandName: "Stripe",
  tagline: "Financial infrastructure for the internet. Millions of companies use Stripe to accept payments and manage their businesses online.",
  logo: {
    type: "text",
    textWordmark: "stripe",
    score: 5,
    inHeader: true
  },
  logoCandidates: [
    { type: "text", textWordmark: "stripe", score: 5, inHeader: true }
  ],
  favicon: "https://stripe.com/favicon.ico",
  allFavicons: [],
  palette: [
    {
      id: "color-1",
      role: "Primary Brand",
      label: "Stripe Blurple",
      hex: "#635bff",
      rgb: "rgb(99, 91, 255)",
      hsl: "hsl(243, 100%, 68%)",
      cmyk: { c: 61, m: 64, y: 0, k: 0, string: "C:61% M:64% Y:0% K:0%" },
      isDark: true,
      contrastWhite: 4.8,
      contrastBlack: 4.4,
      suggestedUsage: "Main vehicle wrap stripe, hero buttons, primary logo accent"
    },
    {
      id: "color-2",
      role: "Secondary Brand",
      label: "Cyan Accent",
      hex: "#00d4ff",
      rgb: "rgb(0, 212, 255)",
      hsl: "hsl(190, 100%, 50%)",
      cmyk: { c: 100, m: 17, y: 0, k: 0, string: "C:100% M:17% Y:0% K:0%" },
      isDark: false,
      contrastWhite: 1.6,
      contrastBlack: 13.2,
      suggestedUsage: "High-visibility badges, website highlights, truck accents"
    },
    {
      id: "color-3",
      role: "Accent",
      label: "Amber Gold",
      hex: "#ff70a6",
      rgb: "rgb(255, 112, 166)",
      hsl: "hsl(337, 100%, 72%)",
      cmyk: { c: 0, m: 56, y: 35, k: 0, string: "C:0% M:56% Y:35% K:0%" },
      isDark: false,
      contrastWhite: 2.1,
      contrastBlack: 10.1,
      suggestedUsage: "Special badge accents, campaign highlights"
    },
    {
      id: "color-4",
      role: "Dark Neutral",
      label: "Slate Midnight",
      hex: "#0a2540",
      rgb: "rgb(10, 37, 64)",
      hsl: "hsl(210, 73%, 15%)",
      cmyk: { c: 84, m: 42, y: 0, k: 75, string: "C:84% M:42% Y:0% K:75%" },
      isDark: true,
      contrastWhite: 14.7,
      contrastBlack: 1.4,
      suggestedUsage: "Door lettering, phone number, high-contrast vehicle text"
    },
    {
      id: "color-5",
      role: "Light Neutral",
      label: "Clean Surface",
      hex: "#f6f9fc",
      rgb: "rgb(246, 249, 252)",
      hsl: "hsl(210, 38%, 98%)",
      cmyk: { c: 2, m: 1, y: 0, k: 1, string: "C:2% M:1% Y:0% K:1%" },
      isDark: false,
      contrastWhite: 1.1,
      contrastBlack: 19.5,
      suggestedUsage: "Vehicle base paint, background surfaces"
    }
  ],
  typography: {
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    googleFonts: ["Plus Jakarta Sans", "Inter"],
    detectedCssFonts: ["Plus Jakarta Sans", "Inter", "system-ui"],
    hierarchy: [
      { level: "H1", name: "Heading 1 (Hero Title)", size: "48px / 3rem", weight: "700 Bold", lineHeight: "1.1", font: "Plus Jakarta Sans", sampleText: "Financial infrastructure for the internet" },
      { level: "H2", name: "Heading 2 (Section Title)", size: "32px / 2rem", weight: "600 SemiBold", lineHeight: "1.25", font: "Plus Jakarta Sans", sampleText: "A fully integrated suite of payments products" },
      { level: "H3", name: "Heading 3 (Card Title)", size: "24px / 1.5rem", weight: "600 SemiBold", lineHeight: "1.3", font: "Plus Jakarta Sans", sampleText: "Global payments made effortless" },
      { level: "H4", name: "Heading 4 (Subheading)", size: "18px / 1.125rem", weight: "500 Medium", lineHeight: "1.4", font: "Plus Jakarta Sans", sampleText: "Fastest-improving platform" },
      { level: "Body", name: "Body Text (Paragraphs)", size: "16px / 1rem", weight: "400 Regular", lineHeight: "1.6", font: "Inter", sampleText: "Millions of companies of all sizes use Stripe online and in person to accept payments, send payouts, and manage their businesses." },
      { level: "Button", name: "Button / CTA Text", size: "14px / 0.875rem", weight: "600 SemiBold", lineHeight: "1.0", font: "Inter", sampleText: "START NOW �" },
      { level: "Caption", name: "Caption / Micro Text", size: "12px / 0.75rem", weight: "400 Regular", lineHeight: "1.4", font: "Inter", sampleText: "� Stripe, Inc. CMYK calibrated." }
    ]
  },
  icons: [
    { name: "Custom Vector SVGs", type: "Vector" }
  ],
  tech: ["React", "Tailwind CSS"],
  printSpecs: {}
};

export default function App() {
  const [url, setUrl] = useState("");
  const [brandData, setBrandData] = useState(initialDemoData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "colors" | "typography" | "print" | "ai"
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAgModal, setShowAgModal] = useState(false);

  const handleAnalyze = async (targetUrl) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: targetUrl })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || "Failed to analyze target website");
      }

      const data = await response.json();
      setBrandData(data);
      setActiveTab("overview");
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message || "Failed to connect to website. Please check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Brand Overview & Logo", icon: Sparkles },
    { id: "colors", label: "Color Palette & CMYK", icon: Palette },
    { id: "typography", label: "Typography & Scale", icon: Type },
    { id: "print", label: "Commercial Fleet & Livery", icon: Truck },
    { id: "ai", label: "AI Emulation & Tokens", icon: Bot },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAntigravityGuide={() => setShowAgModal(true)}
        onExportPdf={() => setShowPdfModal(true)}
        hasData={!!brandData}
        brandName={brandData?.brandName}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* URL Input Bar */}
        <UrlInputBar
          url={url}
          setUrl={setUrl}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
        />

        {/* Loading Progress */}
        {isLoading && <AnalysisLoading />}

        {/* Active Brand Kit Workspace */}
        {!isLoading && brandData && (
          <div className="mt-8 space-y-6">
            {/* Tab Navigation */}
            <div className="flex items-center space-x-2 border-b border-slate-800/80 overflow-x-auto pb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold rounded-t-xl transition border-b-2 whitespace-nowrap ${
                      isActive
                        ? "border-indigo-500 text-white bg-slate-900/60 shadow-sm"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="pt-4">
              {activeTab === "overview" && (
                <OverviewTab brandData={brandData} setBrandData={setBrandData} />
              )}
              {activeTab === "colors" && (
                <ColorsTab brandData={brandData} setBrandData={setBrandData} />
              )}
              {activeTab === "typography" && (
                <TypographyTab brandData={brandData} setBrandData={setBrandData} />
              )}
              {activeTab === "print" && (
                <PrintTruckTab brandData={brandData} />
              )}
              {activeTab === "ai" && (
                <AiEmulationTab brandData={brandData} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 mt-16 text-center text-xs text-slate-500">
        <p>
          BrandKit Studio &bull; Zero Paid API Scraper &bull; Designed for Vehicles, Print & Web Emulation
        </p>
      </footer>

      {/* Modals */}
      {showPdfModal && brandData && (
        <PdfExportModal
          brandData={brandData}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {showAgModal && (
        <AntigravityGuideModal
          onClose={() => setShowAgModal(false)}
        />
      )}
    </div>
  );
}
