import React, { useRef, useState } from "react";
import { 
  X, 
  Download, 
  Printer, 
  Check, 
  Loader2, 
  Sparkles, 
  FileText,
  Truck
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import confetti from "canvas-confetti";

export default function PdfExportModal({ brandData, onClose }) {
  const printRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const primary = brandData.palette.find((c) => c.role === "Primary Brand") || brandData.palette[0];
  const secondary = brandData.palette.find((c) => c.role === "Secondary Brand") || brandData.palette[1] || primary;
  const accent = brandData.palette.find((c) => c.role === "Accent") || brandData.palette[2] || primary;
  const dark = brandData.palette.find((c) => c.role === "Dark Neutral") || { hex: "#0f172a" };
  const light = brandData.palette.find((c) => c.role === "Light Neutral") || { hex: "#ffffff" };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    try {
      // Find all page elements
      const pages = printRef.current.querySelectorAll(".pdf-page-container");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2, // High DPI
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const imgWidth = 210; // A4 width mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save(`${brandData.brandName.toLowerCase().replace(/\s+/g, "-")}-brand-kit.pdf`);

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
        {/* Modal Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              Official Brand Kit PDF Preview
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
                  <span>Download PDF Document</span>
                </>
              )}
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              title="Direct Print"
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

        {/* Scrollable PDF Preview Document */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60 flex justify-center">
          <div ref={printRef} className="w-[794px] space-y-8 text-slate-900 font-sans">
            {/* PAGE 1: COVER */}
            <div className="pdf-page-container w-[794px] min-h-[1123px] bg-white p-14 flex flex-col justify-between shadow-2xl relative border border-slate-200">
              {/* Header Accent Bar */}
              <div className="w-full h-3 rounded-full" style={{ backgroundColor: primary.hex }} />

              <div className="my-auto space-y-10">
                {/* Logo Showcase */}
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 inline-block min-w-[280px]">
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
                    <span
                      className="text-4xl font-black tracking-tight"
                      style={{
                        fontFamily: brandData.typography.headingFont,
                        color: primary.hex
                      }}
                    >
                      {brandData.logo.textWordmark}
                    </span>
                  )}
                </div>

                <div>
                  <h1
                    className="text-5xl font-black tracking-tight text-slate-900 uppercase"
                    style={{ fontFamily: brandData.typography.headingFont }}
                  >
                    {brandData.brandName}
                  </h1>
                  <p className="text-xl text-slate-600 font-medium mt-3 max-w-lg">
                    Brand Identity, Color Standards & Commercial Fleet Livery Guide
                  </p>
                </div>

                {/* Micro Meta */}
                <div className="pt-6 border-t border-slate-200 flex items-center space-x-6 text-xs text-slate-500 font-mono">
                  <span>URL: {brandData.hostname}</span>
                  <span>&bull;</span>
                  <span>CMYK / RGB / HEX CALIBRATED</span>
                  <span>&bull;</span>
                  <span>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>

              {/* Cover Footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                <span>OFFICIAL BRAND SPECIFICATION</span>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primary.hex }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondary.hex }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent.hex }} />
                </div>
                <span>PAGE 01</span>
              </div>
            </div>

            {/* PAGE 2: COLOR STANDARDS & CMYK */}
            <div className="pdf-page-container w-[794px] min-h-[1123px] bg-white p-14 flex flex-col justify-between shadow-2xl border border-slate-200">
              <div>
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 mb-8">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase text-slate-900">
                      01 &bull; Color Palette & Print Standards
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Strict color consistency across web, screen displays, and commercial truck vinyl print.
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
                      <div className="p-3 bg-slate-50 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{c.label || c.role}</span>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">{c.role}</span>
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

                {/* Print Guide Note */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">CMYK Printing Calibration Note:</p>
                  <p>
                    For physical vinyl wrap printing on vehicle fleets, supply CMYK values using SWOP or FOGRA39 profiles. Ensure a test swatch is approved on cast vinyl under daylight prior to full fleet wrap installation.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                <span>BRAND SPECIFICATION</span>
                <span>PAGE 02</span>
              </div>
            </div>

            {/* PAGE 3: TYPOGRAPHY & COMMERCIAL FLEET LIVERY */}
            <div className="pdf-page-container w-[794px] min-h-[1123px] bg-white p-14 flex flex-col justify-between shadow-2xl border border-slate-200">
              <div>
                <div className="flex items-center justify-between border-b pb-4 border-slate-200 mb-8">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase text-slate-900">
                      02 &bull; Typography & Vehicle Livery Guide
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Font sizing hierarchy and vehicle wrap specifications.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {brandData.brandName}
                  </span>
                </div>

                {/* Fonts */}
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
                      Used for vehicle door lettering, titles & billboard displays.
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
                      Used for contact info, descriptions & fine print.
                    </p>
                  </div>
                </div>

                {/* Fleet Wrap Guidelines Box */}
                <div className="border border-slate-300 rounded-xl p-5 mb-6 bg-slate-50">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-3">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <h4>Fleet & Truck Wrap Directives</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900 block">Lettering Minimum Height:</span>
                      <span>3.5 inches (9 cm) for city traffic; 7.0 inches (18 cm) for highway recognition.</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">Recommended Material:</span>
                      <span>3M 1080/2080 Cast Vinyl or Avery MPI 1105 with gloss UV laminate.</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">Clearspace Distance:</span>
                      <span>Minimum 4 inches (10 cm) away from door handles, panel gaps and rivets.</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">Livery Accent Band:</span>
                      <span>Apply Primary ({primary.hex}) and Accent ({accent.hex}) along lower body line.</span>
                    </div>
                  </div>
                </div>

                {/* Type scale preview */}
                <div className="space-y-3 pt-2">
                  <div className="text-3xl font-black text-slate-900" style={{ fontFamily: brandData.typography.headingFont }}>
                    H1: {brandData.brandName} &mdash; Driving Innovation
                  </div>
                  <div className="text-xl font-bold text-slate-800" style={{ fontFamily: brandData.typography.headingFont }}>
                    H2: Precision Vehicle Fleet & Digital Guidelines
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: brandData.typography.bodyFont }}>
                    Body: Maintain consistent typographic weight and spacing across all client-facing assets, apparel, and commercial vehicle wraps.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                <span>CONFIDENTIAL BRAND IDENTITY</span>
                <span>PAGE 03</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
