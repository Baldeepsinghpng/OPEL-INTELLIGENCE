'use client';

import React from 'react';
import Link from 'next/link';
import { useVehicle } from '@/context/VehicleContext';
import { formatKm } from '@/lib/utils';
import { Wrench, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';

export const MaintenanceQuickCard: React.FC = () => {
  const { maintenanceItems, activeVehicle, useImperial } = useVehicle();

  const dueSoonItems = maintenanceItems.filter((i) => i.status === 'due-soon');
  const goodItems = maintenanceItems.filter((i) => i.status === 'good');

  return (
    <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-opel-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Smart Maintenance</h2>
              <p className="text-xs text-opel-silver font-mono">
                Verified European Manufacturer Guidelines
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            {dueSoonItems.length} Item Due Soon
          </span>
        </div>

        {/* Next Scheduled Task Item */}
        <div className="py-4 space-y-3">
          {dueSoonItems.slice(0, 1).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-opel-graphite to-opel-graphite border border-amber-500/30 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                  Every {formatKm(item.intervalKm, useImperial)}
                </span>
              </div>
              <p className="text-xs text-opel-silver leading-relaxed">
                {item.description}
              </p>
              <div className="text-[11px] text-opel-silver/80 italic font-mono pt-1">
                Tip: {item.educationalNote.slice(0, 110)}...
              </div>
            </div>
          ))}

          {/* Quick Checklist summary */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] uppercase font-mono tracking-wider text-opel-silver/70">
              Certified Systems Checklist
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-opel-graphite/60 border border-opel-border/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-white truncate">HV Battery Coolant</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-opel-graphite/60 border border-opel-border/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-white truncate">DOT 4 Brake Fluid</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-opel-graphite/60 border border-opel-border/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-white truncate">Interlock Insulation</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-opel-graphite/60 border border-opel-border/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-white truncate">12V AGM Conductance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-opel-border/60 flex items-center justify-between">
        <span className="text-xs text-opel-silver font-mono">
          Vehicle Odometer: {formatKm(activeVehicle.odometerKm, useImperial)}
        </span>
        <Link
          href="/maintenance"
          className="text-xs text-opel-lime hover:underline font-semibold flex items-center gap-1 group"
        >
          <span>View Maintenance Timeline</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
