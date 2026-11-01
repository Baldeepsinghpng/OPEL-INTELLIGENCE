'use client';

import React, { useState } from 'react';
import { useVehicle } from '@/context/VehicleContext';
import { Zap, BatteryCharging, Clock, Sliders, Info, ShieldCheck } from 'lucide-react';

export const BatteryStatusCard: React.FC = () => {
  const { activeVehicle, activeSpec, setSoc, toggleCharging } = useVehicle();
  const [targetSoc, setTargetSoc] = useState<number>(80);

  const netCapacity = activeSpec.batteryCapacityNetKwh || (activeSpec.batteryCapacityGrossKwh ? activeSpec.batteryCapacityGrossKwh * 0.94 : 50);
  const currentEnergyKwh = ((activeVehicle.currentSocPercent / 100) * netCapacity).toFixed(1);

  // Time remaining to target SoC
  const energyNeededKwh = Math.max(0, ((targetSoc - activeVehicle.currentSocPercent) / 100) * netCapacity);
  const rateKw = activeVehicle.isCharging ? (activeVehicle.chargingRateKw || 11.0) : 11.0;
  const minutesRemaining = Math.round((energyNeededKwh / rateKw) * 60);

  return (
    <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-opel-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-opel-lime/10 text-opel-lime border border-opel-lime/30">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Traction Battery State</h2>
              <p className="text-xs text-opel-silver font-mono">
                {netCapacity} kWh Net ({activeSpec.batteryCapacityGrossKwh} kWh Gross)
              </p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
              activeVehicle.isCharging
                ? 'bg-opel-lime/20 text-opel-lime border border-opel-lime/40 animate-pulse'
                : 'bg-opel-graphite text-opel-silver border border-opel-border'
            }`}
          >
            {activeVehicle.isCharging ? 'Charging Active' : 'Standby / Idle'}
          </span>
        </div>

        {/* Circular Progress & Visual Bar */}
        <div className="py-6 space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight">
                {activeVehicle.currentSocPercent}
              </span>
              <span className="text-2xl font-bold text-opel-lime">%</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white font-mono">{currentEnergyKwh} kWh</span>
              <div className="text-[11px] text-opel-silver">Available Energy</div>
            </div>
          </div>

          {/* Interactive Range Gauge Track */}
          <div className="relative w-full h-3 rounded-full bg-opel-graphite overflow-hidden border border-opel-border/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-opel-lime-muted via-opel-lime to-emerald-400 transition-all duration-500 shadow-lime-glow-sm"
              style={{ width: `${activeVehicle.currentSocPercent}%` }}
            />
            {/* Target Marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm z-10"
              style={{ left: `${targetSoc}%` }}
              title={`Target charge limit: ${targetSoc}%`}
            />
          </div>

          {/* State of Charge Quick Adjuster (Simulated) */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-opel-silver mb-1.5 font-mono">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Simulate Battery Level:
              </span>
              <span className="font-bold text-white">{activeVehicle.currentSocPercent}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={activeVehicle.currentSocPercent}
              onChange={(e) => setSoc(Number(e.target.value))}
              className="w-full accent-opel-lime bg-opel-graphite h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Target Limit Selector */}
          <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border/60">
            <div className="flex items-center justify-between text-xs text-opel-silver mb-2">
              <span className="font-medium text-white flex items-center gap-1.5">
                Target Charge Limit
                <Info className="w-3.5 h-3.5 text-opel-silver/70" />
              </span>
              <span className="font-mono font-bold text-opel-lime">{targetSoc}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[80, 90, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => setTargetSoc(val)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    targetSoc === val
                      ? 'bg-opel-lime text-black shadow-lime-glow-sm'
                      : 'bg-opel-carbon border border-opel-border text-opel-silver hover:text-white'
                  }`}
                >
                  {val}% {val === 80 ? '(Daily)' : val === 100 ? '(Trip)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charging Estimate Footnote */}
      <div className="pt-4 border-t border-opel-border/60 flex items-center justify-between text-xs text-opel-silver font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-opel-silver" />
          <span>
            {activeVehicle.currentSocPercent >= targetSoc
              ? 'Target SoC Reached'
              : `~${minutesRemaining} min to ${targetSoc}% @ ${rateKw} kW`}
          </span>
        </div>
        <button
          onClick={toggleCharging}
          className="text-opel-lime hover:underline font-semibold"
        >
          {activeVehicle.isCharging ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
};
