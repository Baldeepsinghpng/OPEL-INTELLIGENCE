'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVehicle } from '@/context/VehicleContext';
import { formatKm, formatEur, formatTemp } from '@/lib/utils';
import { 
  Zap, 
  Lock, 
  Unlock, 
  Fan, 
  BatteryCharging, 
  Gauge, 
  Sparkles, 
  ShieldCheck, 
  RotateCw,
  Compass,
  ArrowRight
} from 'lucide-react';

export const CockpitOverview: React.FC = () => {
  const {
    activeVehicle,
    activeSpec,
    useImperial,
    toggleLock,
    toggleClimate,
    toggleCharging,
    refreshTelemetry,
  } = useVehicle();

  // Calculate estimated range based on battery SoC
  const estimatedRangeKm = Math.round(
    (activeVehicle.currentSocPercent / 100) * activeSpec.wltpRangeKm
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-opel-border bg-gradient-to-br from-opel-carbon via-opel-graphite to-opel-carbon p-6 lg:p-8 shadow-2xl">
      {/* Background Subtle Vizor Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-opel-lime/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Vehicle Meta & Key Metric HUD */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Tagline */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-opel-lime text-black shadow-lime-glow-sm">
              {activeSpec.powertrain === 'BEV' ? '100% Electric BEV' : 'Plug-in Hybrid PHEV'}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono text-opel-silver bg-opel-slate/80 border border-opel-border">
              {activeSpec.platform} Architecture
            </span>
            <span className="text-xs text-opel-silver font-mono">
              Model Year {activeSpec.modelYear}
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              {activeVehicle.customName}
            </h1>
            <p className="text-sm text-opel-silver mt-1">
              {activeSpec.name} • <span className="font-mono text-white">{activeVehicle.licensePlate}</span> • {activeVehicle.colorName}
            </p>
          </div>

          {/* Large Metric Gauge Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            {/* Battery / Range Metric */}
            <div className="p-4 rounded-xl bg-opel-black/60 border border-opel-border/80">
              <div className="flex items-center justify-between text-xs text-opel-silver mb-1">
                <span>Usable Range</span>
                <Zap className="w-3.5 h-3.5 text-opel-lime" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">
                {formatKm(estimatedRangeKm, useImperial)}
              </div>
              <div className="text-xs text-opel-silver font-mono mt-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-opel-lime animate-pulse" />
                {activeVehicle.currentSocPercent}% SoC
              </div>
            </div>

            {/* Odometer */}
            <div className="p-4 rounded-xl bg-opel-black/60 border border-opel-border/80">
              <div className="flex items-center justify-between text-xs text-opel-silver mb-1">
                <span>Odometer</span>
                <Gauge className="w-3.5 h-3.5 text-opel-silver" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">
                {formatKm(activeVehicle.odometerKm, useImperial)}
              </div>
              <div className="text-xs text-opel-silver font-mono mt-1">
                Verified European Spec
              </div>
            </div>

            {/* Battery Health */}
            <div className="p-4 rounded-xl bg-opel-black/60 border border-opel-border/80 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-opel-silver mb-1">
                <span>Battery SoH</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">
                {activeVehicle.batteryHealthSoHPercent}%
              </div>
              <div className="text-xs text-opel-silver font-mono mt-1">
                Cell Balance: Optimal
              </div>
            </div>
          </div>

          {/* Interactive Vehicle Quick Controls */}
          <div className="pt-2">
            <div className="text-xs uppercase font-mono tracking-wider text-opel-silver/70 mb-2.5">
              Simulated Cockpit Controls
            </div>
            <div className="flex flex-wrap gap-2.5">
              {/* Lock/Unlock */}
              <button
                onClick={toggleLock}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                  activeVehicle.isLocked
                    ? 'bg-opel-black/80 border-opel-border text-opel-silver hover:text-white hover:border-opel-border-bright'
                    : 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                }`}
              >
                {activeVehicle.isLocked ? (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Doors Secured</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-amber-400" />
                    <span>Doors Unlocked</span>
                  </>
                )}
              </button>

              {/* Climate Preconditioning */}
              <button
                onClick={toggleClimate}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                  activeVehicle.climatePreconditioningActive
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-sm'
                    : 'bg-opel-black/80 border-opel-border text-opel-silver hover:text-white hover:border-opel-border-bright'
                }`}
              >
                <Fan
                  className={`w-4 h-4 ${
                    activeVehicle.climatePreconditioningActive ? 'text-blue-400 animate-spin' : ''
                  }`}
                />
                <span>
                  {activeVehicle.climatePreconditioningActive
                    ? `Preconditioning (${formatTemp(activeVehicle.targetCabinTempC, useImperial)})`
                    : 'Precondition Cabin'}
                </span>
              </button>

              {/* Charging Toggle */}
              <button
                onClick={toggleCharging}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                  activeVehicle.isCharging
                    ? 'bg-opel-lime/20 border-opel-lime text-opel-lime shadow-lime-glow-sm'
                    : 'bg-opel-black/80 border-opel-border text-opel-silver hover:text-white hover:border-opel-border-bright'
                }`}
              >
                <BatteryCharging className="w-4 h-4" />
                <span>
                  {activeVehicle.isCharging
                    ? `Charging (${activeVehicle.chargingRateKw} kW)`
                    : 'Plug-in Charge'}
                </span>
              </button>

              {/* Sync Telemetry */}
              <button
                onClick={refreshTelemetry}
                title="Refresh Simulated Telemetry"
                className="p-2 rounded-xl bg-opel-black/80 border border-opel-border text-opel-silver hover:text-white hover:border-opel-border-bright transition-all"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: High-Res Automotive Presentation Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-opel-border shadow-2xl group">
            {/* Real Automotive Visual */}
            <img
              src={activeSpec.heroImage}
              alt={activeSpec.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-opel-black via-transparent to-transparent opacity-80" />

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-opel-black/70 backdrop-blur-md px-3 py-2 rounded-lg border border-opel-border/60">
              <span className="font-semibold text-white truncate mr-2">{activeSpec.name}</span>
              <Link
                href="/explorer"
                className="text-opel-lime hover:underline font-mono text-[11px] flex items-center gap-1 shrink-0"
              >
                <span>Full Specs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Quick Specifications Footnote */}
          <div className="w-full grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="p-2 rounded-lg bg-opel-black/40 border border-opel-border/50">
              <div className="text-[10px] text-opel-silver font-mono">Acceleration</div>
              <div className="text-xs font-bold text-white font-mono">{activeSpec.acceleration0To100Kmh}s (0-100)</div>
            </div>
            <div className="p-2 rounded-lg bg-opel-black/40 border border-opel-border/50">
              <div className="text-[10px] text-opel-silver font-mono">Max DC Speed</div>
              <div className="text-xs font-bold text-opel-lime font-mono">{activeSpec.maxDcChargingPowerKw} kW</div>
            </div>
            <div className="p-2 rounded-lg bg-opel-black/40 border border-opel-border/50">
              <div className="text-[10px] text-opel-silver font-mono">Peak Power</div>
              <div className="text-xs font-bold text-white font-mono">{activeSpec.powerHp} hp ({activeSpec.powerKw} kW)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
