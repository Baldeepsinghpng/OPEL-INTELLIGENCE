'use client';

import React, { useState } from 'react';
import { useVehicle } from '@/context/VehicleContext';
import { MaintenanceItem, ServiceRecord } from '@/types/vehicle';
import { formatKm, formatEur } from '@/lib/utils';
import { 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Plus, 
  ShieldCheck, 
  Info, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Car,
  Filter
} from 'lucide-react';

export default function MaintenancePage() {
  const { 
    maintenanceItems, 
    serviceHistory, 
    activeVehicle, 
    activeSpec, 
    useImperial, 
    logServiceRecord 
  } = useVehicle();

  const [expandedItemId, setExpandedItemId] = useState<string | null>(maintenanceItems[1]?.id || null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Form State for Logging New Service
  const [formData, setFormData] = useState({
    title: '',
    workshopName: '',
    costEur: 120,
    odometerKm: activeVehicle.odometerKm,
    itemsServiced: 'Yearly Inspection, Cabin Filter',
    notes: '',
  });

  const categories = ['All', 'Inspection', 'Filter', 'Fluid', 'Safety', 'High-Voltage System'];

  const filteredItems = filterCategory === 'All'
    ? maintenanceItems
    : maintenanceItems.filter((i) => i.category === filterCategory);

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.workshopName) return;

    logServiceRecord({
      date: new Date().toISOString().split('T')[0],
      odometerKm: Number(formData.odometerKm),
      title: formData.title,
      workshopName: formData.workshopName,
      costEur: Number(formData.costEur),
      itemsServiced: formData.itemsServiced.split(',').map((s) => s.trim()),
      notes: formData.notes,
    });

    setShowLogModal(false);
    setFormData({
      title: '',
      workshopName: '',
      costEur: 120,
      odometerKm: activeVehicle.odometerKm,
      itemsServiced: 'Yearly Inspection, Cabin Filter',
      notes: '',
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-opel-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Wrench className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Smart Maintenance
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-opel-lime/20 text-opel-lime border border-opel-lime/40">
              Verified Public Schedules
            </span>
          </div>
          <p className="text-xs text-opel-silver mt-1">
            European factory service intervals, high-voltage diagnostics, and educational component guides for {activeSpec.name}.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 rounded-xl bg-opel-lime text-black font-semibold text-xs flex items-center gap-2 hover:shadow-lime-glow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Service Record</span>
        </button>
      </div>

      {/* Vehicle Service Health Banner */}
      <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="space-y-1">
            <div className="text-xs text-opel-silver uppercase font-mono">Current Odometer</div>
            <div className="text-2xl font-black text-white font-display">
              {formatKm(activeVehicle.odometerKm, useImperial)}
            </div>
            <div className="text-[11px] text-opel-silver font-mono">
              Vehicle: {activeVehicle.customName}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-opel-silver uppercase font-mono">Next Scheduled Due</div>
            <div className="text-2xl font-black text-amber-400 font-display">
              {formatKm(25000, useImperial)}
            </div>
            <div className="text-[11px] text-amber-400 font-mono">
              In ~{formatKm(25000 - activeVehicle.odometerKm, useImperial)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-opel-silver uppercase font-mono">High-Voltage Battery</div>
            <div className="text-2xl font-black text-emerald-400 font-display">
              {activeVehicle.batteryHealthSoHPercent}% SoH
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              Coolant loop nominal
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-opel-silver uppercase font-mono">Warranty Status</div>
            <div className="text-2xl font-black text-white font-display">
              Active
            </div>
            <div className="text-[11px] text-opel-silver font-mono">
              8 Yrs / 160,000 km Battery Pack
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-opel-silver font-mono flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              filterCategory === cat
                ? 'bg-opel-lime text-black shadow-lime-glow-sm'
                : 'bg-opel-carbon border border-opel-border text-opel-silver hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Maintenance Items Detailed List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedItemId === item.id;
          const isDue = item.status === 'due-soon';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all ${
                isDue
                  ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-opel-carbon to-opel-carbon'
                  : 'border-opel-border bg-opel-carbon'
              } p-6 shadow-xl`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isDue
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {isDue ? 'Service Recommended Soon' : 'Status: Optimal'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-opel-graphite text-opel-silver border border-opel-border">
                      {item.category}
                    </span>
                    <span className="text-xs text-opel-silver font-mono">
                      Every {formatKm(item.intervalKm, useImperial)} / {item.intervalMonths} Mos
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-opel-silver leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-opel-silver font-mono">Estimated Cost</div>
                    <div className="text-sm font-bold text-white font-mono">
                      ~{formatEur(item.estimatedCostEur)}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    className="p-2 rounded-lg bg-opel-graphite border border-opel-border text-opel-silver hover:text-white transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Educational Drawer */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-opel-border/60 grid grid-cols-1 md:grid-cols-2 gap-6 bg-opel-graphite/40 -mx-6 -mb-6 p-6 rounded-b-2xl">
                  {/* Left: Engineering Explanation */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-opel-lime font-semibold">
                      <Info className="w-4 h-4" />
                      <span>Why This Maintenance Is Essential</span>
                    </div>
                    <p className="text-xs text-opel-light leading-relaxed">
                      {item.educationalNote}
                    </p>
                  </div>

                  {/* Right: Technical Reference & Standard */}
                  <div className="space-y-2 border-t md:border-t-0 md:border-l border-opel-border/60 pt-4 md:pt-0 md:pl-6">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-opel-silver font-semibold">
                      <FileText className="w-4 h-4 text-opel-silver" />
                      <span>Official Regulatory Standard</span>
                    </div>
                    <p className="text-xs font-mono text-opel-silver">
                      {item.officialRef}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          sessionStorage.setItem('opel_intel_prefill_prompt', `Explain the technical procedure for: ${item.title}`);
                          window.location.href = '/assistant';
                        }}
                        className="text-xs text-opel-lime hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Ask AI Assistant about this service</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Service Record Log History */}
      <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-opel-border/60">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-opel-lime" />
            <div>
              <h2 className="text-base font-bold text-white font-display">Vehicle Digital Service Log</h2>
              <p className="text-xs text-opel-silver font-mono">
                Historical Records & Workshop Stamping
              </p>
            </div>
          </div>
          <span className="text-xs text-opel-silver font-mono">
            {serviceHistory.length} Recorded Entries
          </span>
        </div>

        <div className="space-y-3">
          {serviceHistory.map((record) => (
            <div
              key={record.id}
              className="p-4 rounded-xl bg-opel-graphite/60 border border-opel-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-display">{record.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-opel-slate text-opel-silver border border-opel-border">
                    {record.date}
                  </span>
                </div>
                <div className="text-xs text-opel-silver">
                  Workshop: <span className="text-white">{record.workshopName}</span> • Odometer: {formatKm(record.odometerKm, useImperial)}
                </div>
                <div className="text-[11px] text-opel-silver/80 font-mono">
                  Items: {record.itemsServiced.join(', ')}
                </div>
                {record.notes && (
                  <div className="text-[11px] text-opel-lime/80 italic font-mono pt-0.5">
                    Note: {record.notes}
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-white font-mono">{formatEur(record.costEur)}</div>
                <span className="text-[10px] text-emerald-400 font-mono">Logged & Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Log New Service Record */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-opel-border">
              <h3 className="text-lg font-bold text-white font-display">Log New Service Record</h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-opel-silver hover:text-white text-xs font-mono"
              >
                Cancel [ESC]
              </button>
            </div>

            <form onSubmit={handleSubmitService} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-opel-silver mb-1">
                  Service / Inspection Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Year 1 Inspection & Brake Fluid Test"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-opel-silver mb-1">
                    Workshop Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autohaus Rüsselsheim"
                    value={formData.workshopName}
                    onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                    className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-opel-silver mb-1">
                    Cost in EUR (€)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.costEur}
                    onChange={(e) => setFormData({ ...formData, costEur: Number(e.target.value) })}
                    className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-opel-silver mb-1">
                  Odometer Reading (km)
                </label>
                <input
                  type="number"
                  required
                  value={formData.odometerKm}
                  onChange={(e) => setFormData({ ...formData, odometerKm: Number(e.target.value) })}
                  className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-opel-silver mb-1">
                  Items Serviced (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.itemsServiced}
                  onChange={(e) => setFormData({ ...formData, itemsServiced: e.target.value })}
                  className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-opel-silver mb-1">
                  Technician Diagnostic Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Brake pad wear 15%. Coolant pH within normal bounds."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-opel-graphite border border-opel-border text-xs text-opel-silver hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-opel-lime text-black font-bold text-xs hover:shadow-lime-glow"
                >
                  Save Service Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
