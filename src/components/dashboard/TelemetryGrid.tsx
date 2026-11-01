'use client';

import React from 'react';
import { useVehicle } from '@/context/VehicleContext';
import { formatPressure, formatTemp } from '@/lib/utils';
import { Activity, Disc, Thermometer, ShieldCheck, Cpu } from 'lucide-react';

export const TelemetryGrid: React.FC = () => {
  const { activeVehicle, useImperial } = useVehicle();
  const { tirePressureBar } = activeVehicle;

  return (
    <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-opel-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Chassis & Telemetry</h2>
              <p className="text-xs text-opel-silver font-mono">
                TPMS Wireless Bus • 4-Wheel Sensors
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Nominal
          </span>
        </div>

        {/* 4-Wheel TPMS Visual Diagram */}
        <div className="py-6">
          <div className="text-xs text-opel-silver uppercase font-mono tracking-wider mb-3 text-center">
            Tire Pressure Monitor (Recommended: {formatPressure(tirePressureBar.recommendedBar, useImperial)})
          </div>

          <div className="relative max-w-[280px] mx-auto p-4 rounded-xl bg-opel-graphite/60 border border-opel-border flex flex-col items-center">
            {/* Minimal Car Chassis Wireframe */}
            <div className="w-24 h-40 border-2 border-opel-border/80 rounded-2xl relative my-2 flex items-center justify-center">
              <div className="w-16 h-20 border border-dashed border-opel-border/60 rounded-lg flex items-center justify-center">
                <Disc className="w-6 h-6 text-opel-silver/30" />
              </div>

              {/* Front Left Tire */}
              <div className="absolute -top-3 -left-7 flex flex-col items-center">
                <div className="w-5 h-10 rounded-md bg-opel-slate border border-opel-lime/60 shadow-lime-glow-sm" />
                <span className="text-[10px] font-mono font-bold text-white mt-1">
                  {formatPressure(tirePressureBar.frontLeft, useImperial)}
                </span>
              </div>

              {/* Front Right Tire */}
              <div className="absolute -top-3 -right-7 flex flex-col items-center">
                <div className="w-5 h-10 rounded-md bg-opel-slate border border-opel-lime/60 shadow-lime-glow-sm" />
                <span className="text-[10px] font-mono font-bold text-white mt-1">
                  {formatPressure(tirePressureBar.frontRight, useImperial)}
                </span>
              </div>

              {/* Rear Left Tire */}
              <div className="absolute -bottom-3 -left-7 flex flex-col items-center">
                <div className="w-5 h-10 rounded-md bg-opel-slate border border-opel-lime/60 shadow-lime-glow-sm" />
                <span className="text-[10px] font-mono font-bold text-white mt-1">
                  {formatPressure(tirePressureBar.rearLeft, useImperial)}
                </span>
              </div>

              {/* Rear Right Tire */}
              <div className="absolute -bottom-3 -right-7 flex flex-col items-center">
                <div className="w-5 h-10 rounded-md bg-opel-slate border border-opel-lime/60 shadow-lime-glow-sm" />
                <span className="text-[10px] font-mono font-bold text-white mt-1">
                  {formatPressure(tirePressureBar.rearRight, useImperial)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 12V Battery & Aux Systems Status */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-opel-graphite/40 border border-opel-border/60">
            <div className="text-[10px] uppercase font-mono text-opel-silver">12V AGM Battery</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5 flex items-center justify-between">
              <span>{activeVehicle.auxiliaryBatteryVoltage} Volts</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Healthy & Charged</div>
          </div>

          <div className="p-3 rounded-xl bg-opel-graphite/40 border border-opel-border/60">
            <div className="text-[10px] uppercase font-mono text-opel-silver">Cabin Climate</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5 flex items-center justify-between">
              <span>{formatTemp(activeVehicle.currentCabinTempC, useImperial)}</span>
              <Thermometer className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-[10px] text-opel-silver font-mono mt-0.5">
              Target: {formatTemp(activeVehicle.targetCabinTempC, useImperial)}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-opel-border/60 flex items-center justify-between text-xs text-opel-silver font-mono">
        <span className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-opel-silver" />
          <span>Firmware: {activeVehicle.softwareVersion}</span>
        </span>
        <span className="text-[11px] text-opel-silver/70">CAN-Bus Active</span>
      </div>
    </div>
  );
};
