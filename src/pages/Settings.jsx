import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Database,
  Save,
  Info,
  Server,
  Bot,
  Sparkles,
  GitBranch,
  PowerOff
} from 'lucide-react';
import { api } from '../services/api';

export const Settings = () => {
  const [settings, setSettings] = useState({
    default_min_delay: '8',
    default_max_delay: '20',
    ai_enabled_globally: 'true',
    auto_responder_mode: 'hybrid',
    ai_provider: 'local_ollama',
    ollama_endpoint: 'http://localhost:11434',
    ollama_model: 'llama3:latest'
  });
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    api.getSettings().then((res) => {
      if (res.settings) {
        const s = { ...res.settings };
        if (!s.auto_responder_mode) {
          s.auto_responder_mode = s.ai_enabled_globally === 'false' ? 'disabled' : 'hybrid';
        }
        setSettings(s);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const mode = settings.auto_responder_mode || 'hybrid';
      const toSave = {
        ...settings,
        auto_responder_mode: mode,
        ai_enabled_globally: mode === 'disabled' ? 'false' : 'true'
      };
      await api.saveSettings(toSave);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    } catch (err) {
      alert(`Failed to save settings: ${err.message}`);
    }
  };

  const currentMode = settings.auto_responder_mode || (settings.ai_enabled_globally === 'false' ? 'disabled' : 'hybrid');

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-emerald-400" />
          System & Anti-Ban Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure safety parameters, database paths, and automated dispatch controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Anti-Ban Dispatch Safety Guard */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Anti-Ban Dispatch Safety Guard
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            To prevent WhatsApp multi-device account flagging, the dispatcher uses randomized jitter delays between consecutive messages.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Minimum Delay (Seconds)
              </label>
              <input
                type="number"
                min="3"
                max="60"
                value={settings.default_min_delay || '8'}
                onChange={(e) => setSettings({ ...settings, default_min_delay: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Maximum Delay (Seconds)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.default_max_delay || '20'}
                onChange={(e) => setSettings({ ...settings, default_max_delay: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Automated Auto-Responder Mode Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                Automated Auto-Responder Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose how incoming WhatsApp messages are routed between Visual Flows and the AI Agent.
              </p>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
              currentMode === 'hybrid'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : currentMode === 'flows_only'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : currentMode === 'ai_only'
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {currentMode === 'hybrid' && '🌟 Hybrid (Flows + AI)'}
              {currentMode === 'flows_only' && '⚡ Flows Only'}
              {currentMode === 'ai_only' && '🤖 AI Agent Only'}
              {currentMode === 'disabled' && '⏸️ Auto-Replies Paused'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {/* 1. Hybrid: Flows + AI */}
            <div
              onClick={() =>
                setSettings({
                  ...settings,
                  auto_responder_mode: 'hybrid',
                  ai_enabled_globally: 'true'
                })
              }
              className={`relative cursor-pointer rounded-xl p-4 border transition-all text-left ${
                currentMode === 'hybrid'
                  ? 'bg-emerald-950/30 border-emerald-500/80 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Both: Flows + AI (Hybrid)</h4>
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Recommended</span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                  currentMode === 'hybrid'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-slate-700 bg-slate-900'
                }`}>
                  {currentMode === 'hybrid' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                Visual Flows handle matching trigger keywords and interactive menus. If an incoming inquiry doesn't match any flow, the AI Assistant answers seamlessly using your Knowledge Base & Catalog.
              </p>
            </div>

            {/* 2. Flows Only */}
            <div
              onClick={() =>
                setSettings({
                  ...settings,
                  auto_responder_mode: 'flows_only',
                  ai_enabled_globally: 'true'
                })
              }
              className={`relative cursor-pointer rounded-xl p-4 border transition-all text-left ${
                currentMode === 'flows_only'
                  ? 'bg-blue-950/30 border-blue-500/80 ring-1 ring-blue-500/30 shadow-lg shadow-blue-950/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Flows Only (Strict)</h4>
                    <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Deterministic Menus</span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                  currentMode === 'flows_only'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-700 bg-slate-900'
                }`}>
                  {currentMode === 'flows_only' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                Only triggers when customers send matching keywords or navigate interactive menus. AI responses are strictly confined to flows with an explicit AI Handover node. Unmatched messages outside flows are ignored.
              </p>
            </div>

            {/* 3. AI Agent Only */}
            <div
              onClick={() =>
                setSettings({
                  ...settings,
                  auto_responder_mode: 'ai_only',
                  ai_enabled_globally: 'true'
                })
              }
              className={`relative cursor-pointer rounded-xl p-4 border transition-all text-left ${
                currentMode === 'ai_only'
                  ? 'bg-purple-950/30 border-purple-500/80 ring-1 ring-purple-500/30 shadow-lg shadow-purple-950/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">AI Agent Only</h4>
                    <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Autonomous AI</span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                  currentMode === 'ai_only'
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-slate-700 bg-slate-900'
                }`}>
                  {currentMode === 'ai_only' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                Visual flows are completely bypassed. Every incoming message is dynamically processed 24/7 by your LLM AI Agent using live Knowledge Base and Product Catalog data.
              </p>
            </div>

            {/* 4. Disabled / Manual */}
            <div
              onClick={() =>
                setSettings({
                  ...settings,
                  auto_responder_mode: 'disabled',
                  ai_enabled_globally: 'false'
                })
              }
              className={`relative cursor-pointer rounded-xl p-4 border transition-all text-left ${
                currentMode === 'disabled'
                  ? 'bg-rose-950/30 border-rose-500/80 ring-1 ring-rose-500/30 shadow-lg shadow-rose-950/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <PowerOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Disabled (Manual Only)</h4>
                    <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">No Auto-Replies</span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                  currentMode === 'disabled'
                    ? 'border-rose-500 bg-rose-500'
                    : 'border-slate-700 bg-slate-900'
                }`}>
                  {currentMode === 'disabled' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                Completely stops all automated auto-replies. Incoming messages are still logged in the CRM chat log for human staff, but WhatsApp will never send automatic bot responses.
              </p>
            </div>
          </div>
        </div>

        {/* Storage & Local Architecture Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Storage & Embedded Engine Details
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
              <span>Database Engine:</span>
              <span className="font-mono text-emerald-400">Embedded SQLite (node:sqlite WAL mode)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
              <span>WhatsApp Protocol Core:</span>
              <span className="font-mono text-cyan-400">@whiskeysockets/baileys Multi-Device TLS</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
              <span>Database File Path:</span>
              <span className="font-mono text-slate-400">data/whatsapp_crm.sqlite</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-300">
              <span>Sessions Storage:</span>
              <span className="font-mono text-slate-400">sessions/ (MultiFileAuthState)</span>
            </div>
          </div>
        </div>

        {savedMessage && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-semibold text-center">
            Settings successfully saved!
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

