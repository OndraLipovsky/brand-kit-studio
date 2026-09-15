import React, { useRef, useState } from "react";
import { 
  X, 
  Download, 
  Printer, 
  Check, 
  Loader2, 
  FileText,
  MapPin,
  Sparkles
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";

export default function PdfExportModal({ brandData, onClose }) {
  const printRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const primary = brandData.palette.find((c) => c.role === "Primary Brand") || brandData.palette[0];
  const dark = brandData.palette.find((c) => c.role.includes("Dark") || c.role === "Primary Brand") || { hex: "#2b241c" };
  const background = brandData.palette.find((c) => c.role.includes("Background")) || { hex: "#f5f1ea" };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    try {
      const pages = printRef.current.querySelectorAll(".pdf-page-container");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save(`${brandData.brandName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-brand-kit.pdf`);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error("PDF generation failed, falling back to window.print():", err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              Brand Kit PDF & Guidelines Preview
            </h3>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 transition active:scale-95 shadow-md shadow-indigo-600/30"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rendering PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              title="Print directly"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable PDF Pages Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60 flex justify-center">
          <div ref={printRef} className="w-[794px] space-y-8 text-slate-900 font-sans">
            {/* PAGE 1: COVER */}
            <div className="pdf-page-container w-[794px] min-h-[1123px] bg-white p-14 flex flex-col justify-between shadow-2xl relative border border-slate-200">
              {/* Header Decorative Bar */}
              <div className="w-full h-3 rounded-full" style={{ backgroundColor: dark.hex }} />

              <div className="my-auto space-y-8">
                {/* Logo Showcase (CRISP DARK CONTRAST ALWAYS) */}
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 inline-block min-w-[320px]">
                  {brandData.logo.type === "svg" ? (
                    <div
                      className="max-h-24 max-w-sm flex items-center [&>svg]:max-h-20 [&>svg]:w-auto"
                      dangerouslySetInnerHTML={{ __html: brandData.logo.svgContent }}
                    />
                  ) : brandData.logo.type === "image" ? (
                    <img
                      src={brandData.logo.src}
                      alt={brandData.brandName}
                      className="max-h-20 max-w-sm object-contain"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div>
                      <span
                        className="text-5xl font-serif font-black tracking-tight leading-none block"
                        style={{
                          fontFamily: brandData.typography.headingFont,
                          color: "#1e242b" // Crisp dark charcoal on white paper
                        }}
                      >
                        {brandData.logo.textWordmark}
                      </span>
                      {brandData.logo.subtitleWordmark && (
                        <span
                          className="text-xs uppercase tracking-[0.28em] font-semibold text-slate-600 block mt-2"
                          style={{ fontFamily: brandData.typography.bodyFont }}
                        >
                          {brandData.logo.subtitleWordmark}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h1
                    className="text-4xl font-black tracking-tight text-slate-900 uppercase"
                    style={{ fontFamily: brandData.typography.headingFont }}
                  >
                    {brandData.brandName}
                  </h1>
                  <p className="text-lg text-slate-600 font-medium mt-2 max-w-lg">
                    Official Brand Identity, Typography Scale & Color Standards
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200 flex items-center space-x-6 text-xs text-slate-500 font-mono">
                  <span>URL: {brandData.hostname}</span>
                  <span>&bull;</span>
                  <span>CMYK / RGB / HEX CALIBRATED</span>
                  <span>&bull;</span>
                  <span>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                <span>OFFICIAL BRAND SPECIFICATION</span>
                <span>PAGE 01</span>
              </div>
            </div>

            {/* PAGE 2: COLOR STANDARDS & EXACT USAGE CONTEXT */}
            <div className="pdf-page-container w-[794px] min-h-[1123px] bg-white p-14 flex flex-col justify-between shadow-2xl border border-slate-200">
              <div>
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 mb-8">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase text-slate-900">
                      01 &bull; Color Standards & Context
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Precise color codes and where each color appears on the official website.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {brandData.brandName}
                  </span>
                </div>

                {/* Swatches Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {brandData.palette.slice(0, 6).map((c, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="h-20 w-full" style={{ backgroundColor: c.hex }} />
                      <div className="p-3.5 bg-slate-50 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{c.label || c.role}</span>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">{c.role}</span>
                        </div>

                        {/* Exact context */}
                        <div className="text-[11px] text-indigo-900 bg-indigo-50/80 p-1.5 rounded border border-indigo-100 font-medium">
                          📍 {c.foundIn || "Detected in Stylesheet"}
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-[11px] font-mono pt-1 text-slate-700">
                          <div>HEX: <strong>{c.hex}</strong></div>
                          <div>RGB: {c.rgb}</div>
                          <div className="col-span-2 text-indigo-700 font-bold">
                            CMYK: {c.cmyk?.string}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Color Rules */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                  <p className="font-bold text-slate-900">Usage Directives:</p>
                  <p>
                    Ensure digital designs maintain at least 4.5:1 contrast against the background canvas. For physical print, request proofs matched to the specified CMYK values.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                <span>BRAND SPECIFICATION</span>
                <span>PAGE 02</span>
              </div>
            </div>

            {/* PAGE 3: TYPOGRAPHY HIERARCHY (1:1 ACTUAL SITE) */}
            <div className="pdf-page-container w-[794px] min-h-[1123px] bg-white p-14 flex flex-col justify-between shadow-2xl border border-slate-200">
              <div>
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 mb-8">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase text-slate-900">
                      02 &bull; 1:1 Website Typography
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Exact typographic fonts, scales, and content extracted from {brandData.hostname}.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {brandData.brandName}
                  </span>
                </div>

                {/* Font Families */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                      Primary Headline Font
                    </span>
                    <h3
                      className="text-2xl font-black text-slate-900"
                      style={{ fontFamily: brandData.typography.headingFont }}
                    >
                      {brandData.typography.headingFont}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Editorial serif display setting the artisan brand tone.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
                      Primary Body Font
                    </span>
                    <h3
                      className="text-2xl font-bold text-slate-900"
                      style={{ fontFamily: brandData.typography.bodyFont }}
                    >
                      {brandData.typography.bodyFont}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Clean grotesque sans-serif for UI, paragraphs & specs.
                    </p>
                  </div>
                </div>

                {/* Real hierarchy extracted from the site */}
                <div className="space-y-4 pt-2">
                  <div className="border-b pb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">H1 (Hero Heading)</span>
                    <div className="text-2xl font-black text-slate-900 mt-1 leading-snug" style={{ fontFamily: brandData.typography.headingFont }}>
                      "{brandData.typography.hierarchy?.[0]?.sampleText}"
                    </div>
                  </div>

                  <div className="border-b pb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">H2 (Section Title)</span>
                    <div className="text-xl font-bold text-slate-800 mt-1" style={{ fontFamily: brandData.typography.headingFont }}>
                      "{brandData.typography.hierarchy?.[1]?.sampleText || "Zakázková truhlařina"}"
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Body Paragraphs</span>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1" style={{ fontFamily: brandData.typography.bodyFont }}>
                      "{brandData.typography.hierarchy?.find(h => h.level === "Body")?.sampleText}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                <span>CONFIDENTIAL BRAND SPECIFICATION</span>
                <span>PAGE 03</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}