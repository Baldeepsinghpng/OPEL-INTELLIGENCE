'use client';

import React from 'react';
import Link from 'next/link';
import { CockpitOverview } from '@/components/dashboard/CockpitOverview';
import { BatteryStatusCard } from '@/components/dashboard/BatteryStatusCard';
import { TelemetryGrid } from '@/components/dashboard/TelemetryGrid';
import { MaintenanceQuickCard } from '@/components/dashboard/MaintenanceQuickCard';
import { AssistantShortcutCard } from '@/components/dashboard/AssistantShortcutCard';
import { useVehicle } from '@/context/VehicleContext';
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal, 
  Compass, 
  ExternalLink, 
  ChevronRight, 
  Info 
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { activeVehicle, activeSpec } = useVehicle();

  return (
    <div className="space-y-8 pb-12">
      {/* Cockpit Overview Hero */}
      <CockpitOverview />

      {/* Grid of 4 Key Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Battery & Charging State */}
        <BatteryStatusCard />

        {/* AI Assistant Direct Shortcut */}
        <AssistantShortcutCard />

        {/* Chassis, TPMS & Telemetry */}
        <TelemetryGrid />

        {/* Smart Maintenance Quick Overview */}
        <MaintenanceQuickCard />
      </div>

      {/* Active Vehicle Engineering Features Showcase */}
      <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-opel-border/60 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-opel-lime">
                Verified Engineering Highlights
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              {activeSpec.name} Technology Matrix
            </h3>
          </div>
          <Link
            href="/explorer"
            className="text-xs font-mono text-opel-lime hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Compare in Vehicle Explorer</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {activeSpec.keyFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-opel-graphite/60 border border-opel-border/70 hover:border-opel-lime/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-opel-lime text-xs font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-opel-lime" />
                <span>Feature {idx + 1}</span>
              </div>
              <p className="text-sm font-medium text-white leading-relaxed">
                {feat}
              </p>
            </div>
          ))}
        </div>

        {/* Source Reference Footnote */}
        <div className="mt-6 pt-4 border-t border-opel-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-opel-silver">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-opel-silver/70" />
            <span>Public Verification: {activeSpec.sourceNote}</span>
          </div>
          <a
            href={activeSpec.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-opel-lime hover:underline flex items-center gap-1 font-mono text-[11px]"
          >
            <span>Stellantis Mediaroom Record</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
