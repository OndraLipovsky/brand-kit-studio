import React, { useState } from "react";
import { 
  X, 
  Bot, 
  Zap, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Webhook, 
  DollarSign 
} from "lucide-react";

export default function AntigravityGuideModal({ onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const webhookCode = `// server/webhook-agent.js
// Trigger Antigravity or local scraping agent via HTTP POST with ZERO 3rd-party API fees!
import express from 'express';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

app.post('/api/agent-analyze', (req, res) => {
  const { targetUrl } = req.body;
  if (!targetUrl) return res.status(400).send('targetUrl required');

  console.log(\`[Antigravity Hook] Spawning brand analysis for: \${targetUrl}\`);

  // Option A: Call Antigravity CLI 'agy' or local agent runner
  // E.g.: agy run "Analyze website \${targetUrl} and output brand kit JSON"
  exec(\`node server/cli-analyze.js "\${targetUrl}"\`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true, message: 'Agent analysis completed', data: JSON.parse(stdout) });
  });
});

app.listen(5005, () => console.log('Antigravity webhook listening on :5005'));`;

  const cliRunnerCode = `# Run brand analysis directly via terminal without paid APIs
# PowerShell command:
npm run analyze -- https://stripe.com

# Or pass to Antigravity CLI:
# agy --prompt "Analyze brand identity of https://linear.app and write brand-spec.json"`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                How to Connect Antigravity Agent API ($0 API Cost)
              </h3>
              <p className="text-xs text-slate-400">
                Autonomous brand analysis workflows without paying third-party scraping or OpenAI/Claude API fees
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Highlight Callout */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-300">Why Pay Extra API Fees When You Have Antigravity?</h4>
              <p className="text-slate-300 mt-1 leading-relaxed text-xs">
                Traditional SaaS tools charge $50�$150/month for scraping proxies and OpenAI token bills. With this internal architecture, our local Node.js engine and Antigravity agent process URLs directly on your machine at <strong>$0 cost</strong>.
              </p>
            </div>
          </div>

          {/* 3 Architecture Options */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center space-x-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Recommended Integration Methods</span>
            </h4>

            {/* Method 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300">1. Local Webhook Bridge (Automated Trigger)</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">
                  Most Flexible
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set up a tiny Express webhook listener. Whenever your CRM, form, or dashboard sends a POST request with a URL, it automatically invokes our brand analyzer or calls the Antigravity agent in the background.
              </p>
              <div className="relative mt-2">
                <button
                  onClick={() => copy(webhookCode, "webhook")}
                  className="absolute right-2 top-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center space-x-1"
                >
                  {copiedKey === "webhook" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
                <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                  {webhookCode}
                </pre>
              </div>
            </div>

            {/* Method 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300">2. Antigravity Slash Command or Custom Skill</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded">
                  Pair Programming
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                You can invoke Antigravity right here in this chat by asking:
                <br />
                <em className="text-slate-200">
                  "Analyze website https://stripe.com and output a brand kit with vehicle print specs"
                </em>
                <br />
                The agent uses its built-in subagents and tools without needing any API keys.
              </p>
            </div>

            {/* Method 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-pink-300">3. Batch Queue CLI Runner</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded">
                  Bulk Analysis
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze dozens of competitor or client websites simultaneously by piping a list of URLs into our analyzer engine.
              </p>
              <div className="relative mt-2">
                <button
                  onClick={() => copy(cliRunnerCode, "cli")}
                  className="absolute right-2 top-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center space-x-1"
                >
                  {copiedKey === "cli" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
                <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-pink-300 overflow-x-auto">
                  {cliRunnerCode}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">Antigravity Local Integration Spec</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
