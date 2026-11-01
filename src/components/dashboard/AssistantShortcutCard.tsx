'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Sparkles, ArrowRight, Lightbulb, Compass, Zap } from 'lucide-react';
import { useVehicle } from '@/context/VehicleContext';

const PROMPT_CHIPS = [
  {
    label: 'Analyze winter highway range loss',
    prompt: 'How much range will I lose on the autobahn at 120 km/h in 0°C weather with heating on?',
  },
  {
    label: 'Explain 80% charging taper curve',
    prompt: 'Why does fast charging speed drop after reaching 80% SoC?',
  },
  {
    label: 'Check brake fluid flush interval',
    prompt: 'Why does my EV need a brake fluid flush if I primarily use regenerative braking?',
  },
  {
    label: 'Explain Intelli-Lux LED Matrix headlights',
    prompt: 'How do Opel Intelli-Lux LED Pixel headlights prevent dazzling oncoming drivers?',
  },
];

export const AssistantShortcutCard: React.FC = () => {
  const router = useRouter();
  const { activeVehicle, activeSpec } = useVehicle();

  const handleLaunchPrompt = (prompt: string) => {
    // Store in session storage so the assistant page picks it up immediately
    sessionStorage.setItem('opel_intel_prefill_prompt', prompt);
    router.push('/assistant');
  };

  return (
    <div className="rounded-2xl border border-opel-lime/40 bg-gradient-to-br from-opel-carbon via-opel-graphite to-opel-carbon p-6 shadow-lime-glow-sm flex flex-col justify-between relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-opel-lime/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between pb-4 border-b border-opel-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-opel-lime/20 text-opel-lime border border-opel-lime/40">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">AI Vehicle Assistant</h2>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-opel-lime text-black">
                  GEMINI AI
                </span>
              </div>
              <p className="text-xs text-opel-silver font-mono">
                Context-Aware Automotive Engineering Advisor
              </p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-opel-lime animate-pulse" />
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-opel-silver leading-relaxed">
            Connected to <strong>{activeSpec.name}</strong> live telemetry bus. Ask technical questions grounded in verified European homologation specifications.
          </p>

          <div className="space-y-2 pt-1">
            <div className="text-[11px] uppercase font-mono tracking-wider text-opel-silver/70 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-opel-lime" />
              <span>Suggested Technical Queries</span>
            </div>
            <div className="flex flex-col gap-2">
              {PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLaunchPrompt(chip.prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-opel-graphite/70 border border-opel-border hover:border-opel-lime/50 hover:bg-opel-slate/60 transition-all text-xs text-opel-light flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{chip.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-opel-lime opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-opel-border/60 flex items-center justify-between">
        <span className="text-[11px] text-opel-silver font-mono">
          Model: Gemini 1.5 Flash (Secure Server Route)
        </span>
        <Link
          href="/assistant"
          className="px-3 py-1.5 rounded-lg bg-opel-lime text-black font-semibold text-xs flex items-center gap-1.5 hover:shadow-lime-glow transition-all"
        >
          <span>Open Full Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
