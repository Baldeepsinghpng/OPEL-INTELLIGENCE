'use client';

import React from 'react';
import Link from 'next/link';
import { useVehicle } from '@/context/VehicleContext';
import { 
  Zap, 
  Lock, 
  Unlock, 
  BatteryCharging, 
  Car, 
  ChevronDown, 
  Sparkles,
  Gauge,
  Radio,
  ExternalLink
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeVehicle, 
    activeSpec, 
    userVehicles, 
    setActiveVehicleId, 
    toggleLock, 
    useImperial, 
    setUseImperial 
  } = useVehicle();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-opel-border bg-opel-black/90 backdrop-blur-xl">
      {/* Disclaimer Banner Required by Instructions */}
      <div className="bg-opel-carbon border-b border-opel-border/60 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] font-medium tracking-wider text-opel-silver/80 uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-opel-lime animate-pulse" />
          <span>Independent Automotive Concept Demonstration</span>
          <span className="text-opel-border">•</span>
          <span className="hidden sm:inline">Not affiliated with or endorsed by Opel Automobile GmbH or Stellantis N.V.</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-opel-graphite to-opel-carbon border border-opel-lime/40 group-hover:border-opel-lime transition-colors duration-300 shadow-lime-glow-sm">
            {/* Vizor Lightning Emblem */}
            <svg
              className="w-6 h-6 text-opel-lime transition-transform group-hover:scale-110 duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg text-white font-display">
                OPEL <span className="text-opel-lime font-black">INTELLIGENCE</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-opel-graphite text-opel-silver border border-opel-border">
                v1.0
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-opel-silver/70 font-mono hidden sm:block">
              European Electrified Engineering Platform
            </p>
          </div>
        </Link>

        {/* Right Actions: Vehicle Selector, Units, Telemetry Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Vehicle Quick Selector */}
          <div className="relative group">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-opel-graphite border border-opel-border hover:border-opel-border-bright cursor-pointer transition-colors">
              <Car className="w-4 h-4 text-opel-lime" />
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                  {activeVehicle.customName}
                  <ChevronDown className="w-3 h-3 text-opel-silver group-hover:rotate-180 transition-transform duration-200" />
                </div>
                <div className="text-[10px] text-opel-silver font-mono">
                  {activeVehicle.licensePlate} • {activeVehicle.currentSocPercent}% SoC
                </div>
              </div>
              <div className="md:hidden text-xs font-bold text-white">
                {activeVehicle.currentSocPercent}%
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-72 p-2 rounded-xl bg-opel-carbon border border-opel-border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-wider text-opel-silver/80 border-b border-opel-border/60">
                Switch Active Vehicle
              </div>
              <div className="py-1 space-y-1">
                {userVehicles.map((uv) => (
                  <button
                    key={uv.id}
                    onClick={() => setActiveVehicleId(uv.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      uv.id === activeVehicle.id
                        ? 'bg-opel-graphite text-opel-lime border border-opel-lime/30'
                        : 'text-opel-silver hover:bg-opel-graphite/60 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{uv.customName}</div>
                      <div className="text-[10px] font-mono text-opel-silver">{uv.licensePlate}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-opel-lime font-bold">{uv.currentSocPercent}%</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-opel-border/60">
                <Link
                  href="/garage"
                  className="w-full text-center block py-1.5 text-xs text-opel-lime hover:underline font-medium"
                >
                  Manage Garage & Fleet &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Metric / Imperial Unit Toggle */}
          <button
            onClick={() => setUseImperial(!useImperial)}
            title="Toggle between Metric (km/°C) and Imperial (mi/°F)"
            className="px-2.5 py-1.5 rounded-lg bg-opel-graphite border border-opel-border text-xs font-mono font-medium text-opel-silver hover:text-white hover:border-opel-border-bright transition-colors"
          >
            {useImperial ? 'MI / °F' : 'KM / °C'}
          </button>

          {/* Quick Lock / Unlock Simulation Button */}
          <button
            onClick={toggleLock}
            title={activeVehicle.isLocked ? 'Vehicle is Locked (Click to unlock)' : 'Vehicle is Unlocked (Click to lock)'}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              activeVehicle.isLocked
                ? 'bg-opel-graphite border-opel-border text-opel-silver hover:text-white'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-sm'
            }`}
          >
            {activeVehicle.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          {/* Live Bus Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-opel-slate/40 border border-opel-border/60 text-[11px] font-mono text-opel-silver">
            <Radio className="w-3.5 h-3.5 text-opel-lime animate-pulse" />
            <span>STLA Bus Synced</span>
          </div>
        </div>
      </div>
    </header>
  );
};
