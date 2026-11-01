'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useVehicle } from '@/context/VehicleContext';
import { ChatMessage } from '@/types/vehicle';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  CornerDownLeft, 
  Car, 
  ShieldAlert, 
  Info,
  Terminal,
  Zap,
  HelpCircle
} from 'lucide-react';

const INITIAL_SUGGESTED_QUESTIONS = [
  'How does cold ambient temperature (-5°C) affect my highway range?',
  'Why does DC fast charging taper significantly above 80% SoC?',
  'What scheduled maintenance is required for my high-voltage battery?',
  'Explain the engineering behind the Intelli-Lux LED® Pixel Light system.',
  'How do AGR-certified seats differ from standard vehicle seats?',
  'What is the difference between WLTP rated range and real-world range?',
];

export default function AssistantPage() {
  const { activeVehicle, activeSpec, useImperial } = useVehicle();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message and check for prefill prompt
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-1',
      role: 'assistant',
      content: `Welcome to **OPEL INTELLIGENCE Assistant**. I am calibrated with technical specifications for your **${activeSpec.name}** (${activeVehicle.licensePlate}).

I can assist with real-time physics calculations, WLTP efficiency evaluations, thermal preconditioning protocols, and verified European maintenance guidelines. All technical answers are grounded in public homologation datasheets.

How can I assist your drive today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        {
          title: `${activeSpec.name} European Homologation Specification`,
          source: 'Stellantis Media Opel Hub',
          url: activeSpec.sourceUrl,
        },
      ],
      suggestedFollowUps: [
        'How does winter heating affect my range?',
        'When is my next brake inspection due?',
        'What charging rate can I achieve at a 150 kW Ionity station?',
      ],
    };

    setMessages([welcomeMessage]);

    // Check for prefilled prompt from dashboard shortcut
    const prefill = sessionStorage.getItem('opel_intel_prefill_prompt');
    if (prefill) {
      sessionStorage.removeItem('opel_intel_prefill_prompt');
      setInputValue(prefill);
    }
  }, [activeSpec.id, activeVehicle.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          vehicleContext: {
            modelName: activeSpec.name,
            soc: activeVehicle.currentSocPercent,
            rangeRemainingKm: Math.round((activeVehicle.currentSocPercent / 100) * activeSpec.wltpRangeKm),
            odometerKm: activeVehicle.odometerKm,
            cabinTempC: activeVehicle.currentCabinTempC,
            isCharging: activeVehicle.isCharging,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reach automotive assistant.');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations,
        suggestedFollowUps: data.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Clear the current conversation history?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `Conversation reset. Ready for new technical queries regarding your **${activeSpec.name}**.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-opel-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-opel-lime text-black">
              <Bot className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              AI Vehicle Assistant
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-opel-lime/20 text-opel-lime border border-opel-lime/40">
              Grounded Automotive AI
            </span>
          </div>
          <p className="text-xs text-opel-silver mt-1">
            Engineered with deep automotive physics, WLTP homologation data, and official maintenance intervals.
          </p>
        </div>

        {/* Active Vehicle Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-opel-carbon border border-opel-border text-xs flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-opel-lime" />
            <span className="text-white font-semibold">{activeSpec.name}</span>
            <span className="text-opel-silver font-mono">({activeVehicle.currentSocPercent}% SoC)</span>
          </div>
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-2 rounded-lg bg-opel-carbon border border-opel-border text-opel-silver hover:text-white hover:border-opel-border-bright transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl border border-opel-border bg-opel-carbon shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-opel-graphite border border-opel-border-bright text-white'
                      : 'bg-opel-lime text-black shadow-lime-glow-sm'
                  }`}
                >
                  {isUser ? 'U' : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2 flex-1">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-opel-graphite border border-opel-border-bright text-white'
                        : 'bg-opel-black/80 border border-opel-border text-opel-light'
                    }`}
                  >
                    {/* Render message with formatting */}
                    <div className="whitespace-pre-wrap space-y-2 font-sans">
                      {msg.content}
                    </div>

                    {/* Source Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-opel-border/60 space-y-1.5">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-opel-silver/70 flex items-center gap-1">
                          <Info className="w-3 h-3 text-opel-lime" />
                          <span>Verified Technical Sources:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cite, i) => (
                            <div
                              key={i}
                              className="px-2 py-1 rounded-md bg-opel-graphite/70 border border-opel-border text-[11px] text-opel-silver flex items-center gap-1.5"
                            >
                              <span>{cite.title}</span>
                              {cite.url && (
                                <a
                                  href={cite.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-opel-lime hover:underline"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Timestamp */}
                  <div className={`flex items-center gap-2 text-[10px] text-opel-silver font-mono ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Follow-up suggestions */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((followUp, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(followUp)}
                          className="px-2.5 py-1 rounded-full bg-opel-graphite/60 border border-opel-border text-[11px] text-opel-silver hover:text-white hover:border-opel-lime/40 transition-colors"
                        >
                          {followUp} &rarr;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-xl mr-auto">
              <div className="w-8 h-8 rounded-lg bg-opel-lime text-black flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-opel-black/80 border border-opel-border text-xs text-opel-silver flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-opel-lime animate-ping" />
                <span className="font-mono">Consulting vehicle engineering model & telematics...</span>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-opel-border bg-opel-black/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask about ${activeSpec.name} range, charging, maintenance schedules, or systems...`}
              disabled={isLoading}
              className="flex-1 bg-opel-graphite border border-opel-border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-opel-silver/60 focus:outline-none focus:border-opel-lime focus:ring-1 focus:ring-opel-lime transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-3 rounded-xl bg-opel-lime text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:shadow-lime-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          {/* Independent Concept Disclaimer */}
          <div className="flex items-center justify-between mt-2 text-[10px] text-opel-silver/70 font-mono">
            <span>Independent automotive AI • Not official manufacturer advice</span>
            <span>Gemini API Secure Route</span>
          </div>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
          <HelpCircle className="w-4 h-4 text-opel-lime" />
          <span>Quick Technical Inquiries</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INITIAL_SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-left p-3 rounded-xl bg-opel-graphite/60 border border-opel-border hover:border-opel-lime/40 hover:bg-opel-slate/40 transition-all text-xs text-opel-silver hover:text-white flex items-center justify-between group"
            >
              <span className="truncate pr-2">{q}</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-opel-lime opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
