import React, { useState } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  Lightbulb, 
  Target, 
  Copy, 
  Check, 
  Send, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck,
  Bot
} from "lucide-react";

export default function AiCopywritingTab({ brandData, setBrandData }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [aiAnswers, setAiAnswers] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);

  const copywriting = brandData.copywriting || {
    brandVoice: {
      primaryTone: "Artisanal, High-End Craftsmanship & Reassuring",
      readingEase: "High (Clear, accessible language focused on craft)",
      attributes: [
        "Traditional craftsmanship meets modern bespoke design",
        "Trust-building language ('jedna firma od návrhu po zapojení')",
        "Quality-oriented without aggressive sales pressure"
      ]
    },
    headlineCritique: {
      headlineText: brandData.typography?.hierarchy?.[0]?.sampleText || "Bespoke Interiors & Craftsmanship",
      strengths: "Articulates design, material quality, and craftsmanship clearly.",
      opportunities: "Can incorporate a stronger emotional outcome for homeowners."
    },
    valuePillars: [
      { title: "End-to-End Execution", detail: "Complete execution from 3D design to installation and utility hookup." },
      { title: "Bespoke Customization", detail: "Tailored manufacturing for non-standard spaces." },
      { title: "Transparent Process", detail: "Step-by-step guidance ensuring client peace of mind." }
    ],
    targetAudience: {
      persona: "Discerning Homeowners & Interior Design Clients",
      summary: "Individuals investing in custom living spaces prioritizing durability and craftsmanship."
    },
    aiAlternativeHeadings: [
      `Nábytek, který má duši. Od návrhu po poslední šroubek.`,
      `Interiéry na míru bez kompromisů a starostí.`,
      `Truhlářské řemeslo pro váš domov v Hradci Králové a okolí.`,
      `Přesně pro váš prostor. Kuchyně a skříně z poctivého dřeva.`,
      `Jedna dílna. Jeden tým. Váš vysněný interiér na klíč.`
    ]
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const sampleQuestions = [
    "Write 3 engaging Instagram captions showcasing bespoke furniture craft",
    "How can we improve the hero section CTA to convert more inquiries?",
    "Draft a 30-second local radio commercial script",
    "Summarize the brand voice for freelance writers & marketing team"
  ];

  const handleAskAi = (question) => {
    const q = question || userPrompt;
    if (!q.trim()) return;

    setIsAnswering(true);
    setUserPrompt("");

    setTimeout(() => {
      let reply = "";
      const qLower = q.toLowerCase();

      if (qLower.includes("instagram") || qLower.includes("social")) {
        reply = `📸 **3 Ready-to-Post Instagram Captions for ${brandData.brandName}**:

1. **Craftsmanship Focus:**
"Když dřevo potká přesnost. Každý spoj, každá linie a každý detail vzniká přímo v naší dílně pro váš domov. 🪵✨ Žádná pásová výroba — jen poctivá truhlařina na míru. Jaký prostor v bytě byste svěřili našim rukám?"

2. **Project Transformation:**
"Od první 3D vizualizace po vůni čerstvého dubu u vás doma. 🏡 Kuchyň, která nejen skvěle vypadá, ale funguje do posledního milimetru. Napište nám do zpráv pro nezávaznou konzultaci."

3. **Peace of Mind (Na klíč):**
"Nemusíte shánět truhláře, instalatéra ani elektrikáře. My v ${brandData.brandName} zařídíme vše od návrhu až po zapojení spotřebičů. Jedna smlouva, nulové starosti."`;
      } else if (qLower.includes("cta") || qLower.includes("call to action") || qLower.includes("conversion")) {
        reply = `🎯 **CTA Optimization Strategy for ${brandData.brandName}**:

- **Current CTA:** "Kontakt" or "Nezávazná poptávka" (A bit generic).
- **High-Converting Alternatives:**
  1. *"Získat 3D návrh a nezávaznou kalkulaci"* (Specifies high immediate value).
  2. *"Domluvit zaměření u vás doma"* (Concrete low-friction next step).
  3. *"Prohlédnout si naše realizace & cenové relace"* (Nurturing undecided prospects).

💡 **Pro-Tip:** Place a phone badge next to the button with text: *"Volejte přímo mistru truhláři: +420 774 868 683"* to establish instant human rapport.`;
      } else if (qLower.includes("radio") || qLower.includes("commercial") || qLower.includes("ad")) {
        reply = `📻 **30-Second Commercial Script for ${brandData.brandName}**:

[Zvuk hoblíku a jemné šumění dílny]
**Hlas (klidný, poctivý, přátelský):**
"Už vás nebaví nábytek, který po roce vrže a do vašeho pokoje stejně nepasuje?
V ${brandData.brandName} v Hradci Králové děláme věci jinak.
Navrhneme, vyrobíme a namontujeme kuchyně a skříně přesně na milimetr pro váš prostor.
Jedna firma od 3D vizualizace až po zapojení dřezu i varné desky.
Zastavte se za námi nebo navštivte tskontrast.cz.
${brandData.brandName} — Poctivé interiéry pro váš domov."`;
      } else {
        reply = `🧠 **Brand Voice & Messaging Directive for ${brandData.brandName}**:

- **Brand Archetype:** The Master Craftsman (Creator + Caregiver).
- **Tone:** Grounded, trustworthy, detail-oriented, reassuring, and authentic.
- **Key Vocabulary:** Poctivé dřevo, přesné zaměření, 3D vizualizace, realizace na klíč, bez starostí, čistá montáž.
- **Avoid:** Generic hype ("nejlepší na trhu", "revoluční nábytek"), aggressive countdown timers, or cold corporate jargon.`;
      }

      setAiAnswers((prev) => [{ question: q, reply, timestamp: new Date().toLocaleTimeString() }, ...prev]);
      setIsAnswering(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-purple-950/30 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">AI Copywriting & Brand Messaging</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Intelligent analysis of the website's tone of voice, value propositions, and copywriting hooks with ready-to-use alternative headlines.
          </p>
        </div>
      </div>

      {/* Grid: Voice & Tone + Headline Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Voice Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <MessageSquare className="w-4 h-4" />
            <h3>Brand Voice & Tone</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Primary Tone
            </span>
            <p className="text-sm font-bold text-white">
              {copywriting.brandVoice.primaryTone}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Key Tone Attributes
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {copywriting.brandVoice.attributes.map((attr, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
                  <span>{attr}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Headline Audit Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <h3>Hero Headline Critique</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Analyzed Website H1
            </span>
            <p className="text-xs sm:text-sm font-serif font-bold text-white italic">
              "{copywriting.headlineCritique.headlineText}"
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-emerald-400 block mb-0.5">✓ Strengths:</span>
              <p className="text-slate-300">{copywriting.headlineCritique.strengths}</p>
            </div>
            <div>
              <span className="font-semibold text-amber-400 block mb-0.5">💡 Opportunity:</span>
              <p className="text-slate-300">{copywriting.headlineCritique.opportunities}</p>
            </div>
          </div>
        </div>

        {/* Target Audience Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-pink-400 font-bold text-sm">
            <Target className="w-4 h-4" />
            <h3>Target Audience & Persona</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Core Persona
            </span>
            <p className="text-sm font-bold text-white">
              {copywriting.targetAudience.persona}
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {copywriting.targetAudience.summary}
          </p>
        </div>
      </div>

      {/* Core Value Pillars */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm mb-4">
          <ShieldCheck className="w-4 h-4" />
          <h3>Core Brand Value Pillars (Extracted from Website)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {copywriting.valuePillars.map((pillar, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center mb-2">
                0{idx + 1}
              </span>
              <h4 className="font-bold text-white text-sm mb-1">{pillar.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{pillar.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Slogans & Headlines */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              AI-Generated Alternative Headlines & Slogans
            </h3>
          </div>
          <span className="text-xs text-slate-500">1-Click Copy</span>
        </div>

        <div className="space-y-2.5">
          {copywriting.aiAlternativeHeadings.map((heading, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-4 transition group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span className="text-xs font-mono text-slate-600 font-semibold">#{idx + 1}</span>
                <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                  "{heading}"
                </span>
              </div>
              <button
                onClick={() => copyText(heading, `heading-${idx}`)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition shrink-0"
              >
                {copiedKey === `heading-${idx}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Ask AI Assistant */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white text-sm sm:text-base">
            Ask AI Brand & Copywriting Assistant
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Ask any specific question about the website's copywriting, social media strategy, or conversion optimization.
        </p>

        {/* Quick sample buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskAi(q)}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAi();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder={`Ask AI about ${brandData.brandName}'s copywriting or messaging...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isAnswering || !userPrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold text-xs transition flex items-center space-x-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>

        {/* AI Responses Feed */}
        {aiAnswers.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            {aiAnswers.map((ans, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span className="text-indigo-400">Q: {ans.question}</span>
                  <span className="text-[10px] text-slate-500">{ans.timestamp}</span>
                </div>
                <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {ans.reply}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}