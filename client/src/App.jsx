import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import UrlInputBar from "./components/UrlInputBar.jsx";
import AnalysisLoading from "./components/AnalysisLoading.jsx";
import OverviewTab from "./components/tabs/OverviewTab.jsx";
import ColorsTab from "./components/tabs/ColorsTab.jsx";
import TypographyTab from "./components/tabs/TypographyTab.jsx";
import AiCopywritingTab from "./components/tabs/AiCopywritingTab.jsx";
import AiEmulationTab from "./components/tabs/AiEmulationTab.jsx";
import PdfExportModal from "./components/PdfExportModal.jsx";
import AntigravityGuideModal from "./components/AntigravityGuideModal.jsx";
import HistoryDrawer from "./components/HistoryDrawer.jsx";
import FleetModal from "./components/FleetModal.jsx";
import { getSavedBrands, saveBrandToHistory } from "./utils/historyStorage.js";
import { 
  Sparkles, 
  Palette, 
  Type, 
  MessageSquare, 
  Bot, 
  FileDown 
} from "lucide-react";

// Default initial brand (Kontrast as showcase)
const initialDemoData = {
  url: "https://tskontrast.cz",
  hostname: "tskontrast.cz",
  brandName: "Truhlářské studio Kontrast",
  tagline: "Kuchyně, vestavné skříně a pokoje na míru z Hradce Králové. Návrh, výroba i montáž včetně vody a elektroinstalace.",
  logo: {
    type: "text",
    textWordmark: "Kontrast",
    subtitleWordmark: "Truhlářské studio",
    score: 9,
    inHeader: true
  },
  logoCandidates: [
    { type: "text", textWordmark: "Kontrast", subtitleWordmark: "Truhlářské studio", score: 9, inHeader: true }
  ],
  favicon: "https://tskontrast.cz/favicon.ico",
  palette: [
    {
      id: "color-bg",
      role: "Background Canvas",
      label: "Theme Background Canvas",
      hex: "#f5f1ea",
      rgb: "rgb(245, 241, 234)",
      hsl: "hsl(38, 35%, 94%)",
      cmyk: { c: 0, m: 2, y: 4, k: 4, string: "C:0% M:2% Y:4% K:4%" },
      isDark: false,
      contrastWhite: 1.1,
      contrastBlack: 18.6,
      foundIn: "Browser & Mobile Canvas Theme (`meta theme-color`)",
      contextSnippet: "<meta name=\"theme-color\" content=\"#F5F1EA\">",
      suggestedUsage: "Main website canvas, section background, negative space"
    },
    {
      id: "color-dark",
      role: "Primary Brand",
      label: "Dark Wood / Typography",
      hex: "#2b241c",
      rgb: "rgb(43, 36, 28)",
      hsl: "hsl(32, 21%, 14%)",
      cmyk: { c: 0, m: 16, y: 35, k: 83, string: "C:0% M:16% Y:35% K:83%" },
      isDark: true,
      contrastWhite: 15.3,
      contrastBlack: 1.4,
      foundIn: "FAQ & Divider Accent (<div>) • Frame Borders",
      contextSnippet: "border:1.5px solid var(--faq-frame, #2B241C)",
      suggestedUsage: "Core brand identity tone, prominent logo lettering, primary headings"
    },
    {
      id: "color-accent",
      role: "Micro Accent",
      label: "Detail Accent Line",
      hex: "#b23a48",
      rgb: "rgb(178, 58, 72)",
      hsl: "hsl(353, 51%, 46%)",
      cmyk: { c: 0, m: 67, y: 60, k: 30, string: "C:0% M:67% Y:60% K:30%" },
      isDark: true,
      contrastWhite: 5.8,
      contrastBlack: 3.6,
      foundIn: "FAQ Accent Line (<span>) • Favicon Detail",
      contextSnippet: "background:var(--faq-accent, #b23a48)",
      suggestedUsage: "Subtle indicators, accordion active lines, favicon accents"
    },
    {
      id: "color-neutral",
      role: "Dark Neutral",
      label: "Deep Slate / Text",
      hex: "#4a4a4a",
      rgb: "rgb(74, 74, 74)",
      hsl: "hsl(0, 0%, 29%)",
      cmyk: { c: 0, m: 0, y: 0, k: 71, string: "C:0% M:0% Y:0% K:71%" },
      isDark: true,
      contrastWhite: 9.6,
      contrastBlack: 2.2,
      foundIn: "Paragraph Typography (<p>)",
      contextSnippet: "color:var(--text-muted, #4a4a4a)",
      suggestedUsage: "Secondary body paragraphs, descriptions, specifications"
    }
  ],
  typography: {
    headingFont: "Instrument Serif",
    bodyFont: "Work Sans",
    googleFonts: ["Instrument Serif", "Work Sans"],
    fontWeights: {
      "Instrument Serif": "400 Regular, 400 Italic",
      "Work Sans": "300 Light, 400 Regular, 500 Medium, 600 SemiBold"
    },
    detectedCssFonts: ["Instrument Serif", "Work Sans", "ui-sans-serif"],
    hierarchy: [
      {
        level: "H1",
        name: "Primary Hero Title (H1)",
        font: "Instrument Serif",
        size: "48px – 60px (3rem – 3.75rem)",
        weight: "700 Bold / Regular Serif",
        sampleText: "Interiéry, které vznikají z návrhu, kvalitních materiálů a řemesla.",
        description: "Editorial display heading setting the high-end artisan tone of the brand."
      },
      {
        level: "H2",
        name: "Section Headline (H2)",
        font: "Instrument Serif",
        size: "36px – 44px (2.25rem – 2.75rem)",
        weight: "600 SemiBold / Serif",
        sampleText: "Zakázková truhlařina",
        description: "Major chapter title across feature sections and category portfolios."
      },
      {
        level: "H3",
        name: "Card & Feature Title (H3)",
        font: "Instrument Serif",
        size: "22px – 26px (1.375rem – 1.625rem)",
        weight: "600 SemiBold",
        sampleText: "Kuchyně na míru",
        description: "Product categories, room types, and service steps."
      },
      {
        level: "Body",
        name: "Main Body Paragraphs",
        font: "Work Sans",
        size: "15px – 16px (0.9375rem – 1rem)",
        weight: "400 Regular (Work Sans / Sans)",
        sampleText: "Navrhujeme a vyrábíme kuchyně, vestavné skříně a pokoje na míru. Kompletní realizaci od A do Z zvládneme v rámci jednoho projektu.",
        description: "Optimized for continuous reading, storytelling, and specifications."
      },
      {
        level: "CTA",
        name: "Call to Action / Button",
        font: "Work Sans",
        size: "14px (0.875rem)",
        weight: "600 SemiBold / Uppercase",
        sampleText: "Kontakt",
        description: "High-contrast action triggers for customer inquiries and phone calls."
      }
    ]
  },
  copywriting: {
    brandVoice: {
      primaryTone: "Artisanal, High-End Craftsmanship, Reassuring & Personal",
      attributes: [
        "Traditional craftsmanship meets modern bespoke design",
        "Trust-building language ('jedna firma od návrhu po zapojení')",
        "Quality-oriented without aggressive sales pressure",
        "Transparent step-by-step process orientation ('7 kroků')"
      ]
    },
    headlineCritique: {
      headlineText: "Interiéry, které vznikají z návrhu, kvalitních materiálů a řemesla.",
      strengths: "Clearly articulates the triad of design, material quality, and manual craft. Establishes immediate premium positioning.",
      opportunities: "Could incorporate an explicit customer outcome (e.g. 'domov s jedinečnou atmosférou') to increase emotional resonance."
    },
    valuePillars: [
      { title: "Kompletní realizace na klíč", detail: "Jedna firma od 3D návrhu přes výrobu až po zapojení vody a elektroinstalace." },
      { title: "Nábytek přesně na míru", detail: "Výroba atypických prvků do nestandardních prostor bez kompromisů." },
      { title: "Transparentní proces v 7 krocích", detail: "Zákazník přesně ví, co ho čeká: od zaměření přes vizualizaci po montáž a servis." }
    ],
    targetAudience: {
      persona: "Discerning Homeowners & Interior Design Clients",
      summary: "Individuals investing in custom kitchens, built-in wardrobes, or complete living interiors in Hradec Králové and surroundings who prioritize durability, precision fit, and bespoke craftsmanship over flatpack chain stores."
    },
    aiAlternativeHeadings: [
      "Nábytek, který má duši. Od návrhu po poslední šroubek.",
      "Interiéry na míru bez kompromisů a starostí.",
      "Truhlářské řemeslo pro váš domov v Hradci Králové a okolí.",
      "Přesně pro váš prostor. Kuchyně a skříně z poctivého dřeva.",
      "Jedna dílna. Jeden tým. Váš vysněný interiér na klíč."
    ]
  },
  icons: [{ name: "Lucide Icons", type: "Clean SVG" }],
  tech: ["Tailwind CSS", "React"]
};

export default function App() {
  const [url, setUrl] = useState("");
  const [brandData, setBrandData] = useState(initialDemoData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "colors" | "typography" | "copywriting" | "tokens"
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAgModal, setShowAgModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showFleetModal, setShowFleetModal] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history on mount
  useEffect(() => {
    const saved = getSavedBrands();
    if (saved && saved.length > 0) {
      setHistory(saved);
    } else {
      // Save initial demo
      const updated = saveBrandToHistory(initialDemoData);
      if (updated) setHistory(updated);
    }
  }, []);

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

      // Save to history
      const updatedHistory = saveBrandToHistory(data);
      if (updatedHistory) setHistory(updatedHistory);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message || "Failed to connect to website. Please check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Brand Overview & Logo", icon: Sparkles },
    { id: "colors", label: "Colors & Usage Context", icon: Palette },
    { id: "typography", label: "1:1 Typography & Scale", icon: Type },
    { id: "copywriting", label: "AI Copywriting & Messaging", icon: MessageSquare },
    { id: "tokens", label: "AI Emulation & Tokens", icon: Bot },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Navbar */}
      <Navbar
        onOpenAntigravityGuide={() => setShowAgModal(true)}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onExportPdf={() => setShowPdfModal(true)}
        hasData={!!brandData}
        brandName={brandData?.brandName}
        savedCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UrlInputBar
          url={url}
          setUrl={setUrl}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
        />

        {isLoading && <AnalysisLoading />}

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
                <OverviewTab 
                  brandData={brandData} 
                  setBrandData={setBrandData}
                  onOpenFleetModal={() => setShowFleetModal(true)}
                />
              )}
              {activeTab === "colors" && (
                <ColorsTab brandData={brandData} setBrandData={setBrandData} />
              )}
              {activeTab === "typography" && (
                <TypographyTab brandData={brandData} setBrandData={setBrandData} />
              )}
              {activeTab === "copywriting" && (
                <AiCopywritingTab brandData={brandData} setBrandData={setBrandData} />
              )}
              {activeTab === "tokens" && (
                <AiEmulationTab brandData={brandData} />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 py-6 mt-16 text-center text-xs text-slate-500">
        <p>
          BrandKit Studio &bull; Accurate 1:1 Typography &bull; Color Context Engine &bull; AI Copywriting
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

      {showHistoryDrawer && (
        <HistoryDrawer
          isOpen={showHistoryDrawer}
          onClose={() => setShowHistoryDrawer(false)}
          history={history}
          setHistory={setHistory}
          onSelectBrand={(selected) => {
            setBrandData(selected);
            setActiveTab("overview");
          }}
        />
      )}

      {showFleetModal && brandData && (
        <FleetModal
          brandData={brandData}
          onClose={() => setShowFleetModal(false)}
        />
      )}
    </div>
  );
}