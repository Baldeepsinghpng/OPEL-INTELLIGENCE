'use client';

import React, { useState } from 'react';
import { useVehicle } from '@/context/VehicleContext';
import { OPEL_VEHICLES } from '@/data/vehicles';
import { getSupabaseStatus } from '@/lib/supabase';
import { formatKm, formatEur, formatTemp } from '@/lib/utils';
import { 
  Warehouse, 
  Car, 
  Plus, 
  Trash2, 
  Check, 
  Sliders, 
  Database, 
  Download, 
  Upload, 
  ShieldCheck, 
  Key, 
  Info,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function GaragePage() {
  const { 
    userVehicles, 
    activeVehicle, 
    setActiveVehicleId, 
    addUserVehicle, 
    deleteUserVehicle, 
    useImperial, 
    setUseImperial,
    vehicles 
  } = useVehicle();

  const supabaseStatus = getSupabaseStatus();
  const [showAddModal, setShowAddModal] = useState(false);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    specId: OPEL_VEHICLES[0].id,
    customName: '',
    licensePlate: '',
    colorName: 'Karbon Black',
    odometerKm: 5000,
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.customName || !newVehicle.licensePlate) return;

    addUserVehicle({
      specId: newVehicle.specId,
      customName: newVehicle.customName,
      vinMasked: `W0L0000••••••${Math.floor(1000 + Math.random() * 9000)}`,
      licensePlate: newVehicle.licensePlate,
      colorName: newVehicle.colorName,
      deliveryDate: new Date().toISOString().split('T')[0],
      odometerKm: Number(newVehicle.odometerKm),
      currentSocPercent: 80,
      batteryHealthSoHPercent: 100,
      isCharging: false,
      chargingRateKw: 0,
      isLocked: true,
      climatePreconditioningActive: false,
      targetCabinTempC: 21.0,
      currentCabinTempC: 19.5,
      tirePressureBar: {
        frontLeft: 2.5,
        frontRight: 2.5,
        rearLeft: 2.4,
        rearRight: 2.4,
        recommendedBar: 2.5,
      },
      auxiliaryBatteryVoltage: 12.8,
      softwareVersion: 'IntelliLink 4.2-OTA',
    });

    setShowAddModal(false);
    setNewVehicle({
      specId: OPEL_VEHICLES[0].id,
      customName: '',
      licensePlate: '',
      colorName: 'Karbon Black',
      odometerKm: 5000,
    });
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userVehicles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opel_intelligence_garage_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-opel-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-opel-lime text-black">
              <Warehouse className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              My Garage & Fleet
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-opel-lime/20 text-opel-lime border border-opel-lime/40">
              Demo Fleet Manager
            </span>
          </div>
          <p className="text-xs text-opel-silver mt-1">
            Manage your connected demo vehicles, switch active cockpit context, and synchronize telemetry.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-opel-lime text-black font-semibold text-xs flex items-center gap-2 hover:shadow-lime-glow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle to Garage</span>
        </button>
      </div>

      {/* Supabase / Cloud Sync Diagnostics Card */}
      <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              supabaseStatus.isConfigured 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-display">Cloud Fleet Storage Status</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  supabaseStatus.isConfigured
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {supabaseStatus.mode}
                </span>
              </div>
              <p className="text-xs text-opel-silver mt-0.5 font-mono">
                {supabaseStatus.isConfigured
                  ? `Supabase Endpoint: ${supabaseStatus.url}`
                  : 'Operating in Local Storage Persistent Mode. Supabase environment variables can be provided in .env.local.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-lg bg-opel-graphite border border-opel-border text-xs text-opel-silver hover:text-white flex items-center gap-1.5 transition-colors font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-opel-silver/70">
          Enrolled Vehicles ({userVehicles.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userVehicles.map((veh) => {
            const spec = vehicles.find((s) => s.id === veh.specId) || vehicles[0];
            const isActive = veh.id === activeVehicle.id;

            return (
              <div
                key={veh.id}
                className={`rounded-2xl border p-6 transition-all shadow-xl flex flex-col justify-between ${
                  isActive
                    ? 'border-opel-lime/50 bg-gradient-to-br from-opel-carbon via-opel-graphite to-opel-carbon shadow-lime-glow-sm'
                    : 'border-opel-border bg-opel-carbon'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-opel-border/60">
                    <div className="flex items-center gap-2">
                      <Car className={`w-4 h-4 ${isActive ? 'text-opel-lime' : 'text-opel-silver'}`} />
                      <span className="text-sm font-bold text-white font-display">
                        {veh.customName}
                      </span>
                    </div>

                    {isActive ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-opel-lime text-black shadow-lime-glow-sm">
                        Active Vehicle
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveVehicleId(veh.id)}
                        className="text-xs text-opel-lime hover:underline font-mono"
                      >
                        Set Active &rarr;
                      </button>
                    )}
                  </div>

                  {/* Vehicle Meta & Visual */}
                  <div className="py-4 grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-1 rounded-lg overflow-hidden aspect-[4/3] border border-opel-border">
                      <img
                        src={spec.heroImage}
                        alt={spec.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="col-span-2 space-y-1 text-xs">
                      <div className="font-semibold text-white">{spec.name}</div>
                      <div className="font-mono text-opel-silver">Plate: {veh.licensePlate}</div>
                      <div className="text-opel-silver">Color: {veh.colorName}</div>
                      <div className="text-[11px] text-opel-silver/70 font-mono">VIN: {veh.vinMasked}</div>
                    </div>
                  </div>

                  {/* Telemetry Snapshot */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-2 bg-opel-graphite/40 rounded-xl border border-opel-border/60">
                    <div>
                      <div className="text-[10px] text-opel-silver">Battery</div>
                      <div className="font-bold text-opel-lime">{veh.currentSocPercent}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-opel-silver">Odometer</div>
                      <div className="font-bold text-white">{formatKm(veh.odometerKm, useImperial)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-opel-silver">SoH Health</div>
                      <div className="font-bold text-emerald-400">{veh.batteryHealthSoHPercent}%</div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-opel-border/60 flex items-center justify-between mt-4">
                  <span className="text-[10px] text-opel-silver font-mono">
                    Firmware: {veh.softwareVersion}
                  </span>

                  <div className="flex items-center gap-2">
                    {userVehicles.length > 1 && (
                      <button
                        onClick={() => deleteUserVehicle(veh.id)}
                        title="Remove vehicle from garage"
                        className="p-1.5 rounded-lg text-opel-silver hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {!isActive && (
                      <button
                        onClick={() => setActiveVehicleId(veh.id)}
                        className="px-3 py-1.5 rounded-lg bg-opel-graphite border border-opel-border text-xs text-white hover:border-opel-lime transition-all"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Preferences Panel */}
      <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl space-y-4">
        <div className="pb-3 border-b border-opel-border/60">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Sliders className="w-4 h-4 text-opel-lime" />
            <span>Driver Preferences & System Settings</span>
          </h3>
          <p className="text-xs text-opel-silver font-mono">
            Customize measurement units and simulated telematics protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-opel-graphite/60 border border-opel-border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Measurement Standard</div>
              <div className="text-[11px] text-opel-silver font-mono">
                {useImperial ? 'Miles, PSI, Fahrenheit (°F)' : 'Kilometers, Bar, Celsius (°C)'}
              </div>
            </div>
            <button
              onClick={() => setUseImperial(!useImperial)}
              className="px-3 py-1.5 rounded-lg bg-opel-carbon border border-opel-border text-xs font-mono text-opel-lime hover:border-opel-lime"
            >
              Switch to {useImperial ? 'Metric' : 'Imperial'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-opel-graphite/60 border border-opel-border flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Telematics Protocol</div>
              <div className="text-[11px] text-opel-silver font-mono">STLA SmartBus Telematics 4.1</div>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
              CAN-Bus Live
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Add New Vehicle */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-opel-border">
              <h3 className="text-lg font-bold text-white font-display">Add Vehicle to Garage</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-opel-silver hover:text-white text-xs font-mono"
              >
                Cancel [ESC]
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-opel-silver mb-1">
                  Select Opel Model & Platform
                </label>
                <select
                  value={newVehicle.specId}
                  onChange={(e) => setNewVehicle({ ...newVehicle, specId: e.target.value })}
                  className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                >
                  {OPEL_VEHICLES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.powertrain} • {v.wltpRangeKm} km WLTP)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-opel-silver mb-1">
                  Custom Vehicle Nickname
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Commuter Astra"
                  value={newVehicle.customName}
                  onChange={(e) => setNewVehicle({ ...newVehicle, customName: e.target.value })}
                  className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-opel-silver mb-1">
                    License Plate
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GG-OP 2025E"
                    value={newVehicle.licensePlate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                    className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-opel-silver mb-1">
                    Initial Odometer (km)
                  </label>
                  <input
                    type="number"
                    required
                    value={newVehicle.odometerKm}
                    onChange={(e) => setNewVehicle({ ...newVehicle, odometerKm: Number(e.target.value) })}
                    className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-opel-silver mb-1">
                  Exterior Color Finish
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kult Yellow, Diamond Black, Amber Bronze"
                  value={newVehicle.colorName}
                  onChange={(e) => setNewVehicle({ ...newVehicle, colorName: e.target.value })}
                  className="w-full bg-opel-graphite border border-opel-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-opel-lime"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-opel-graphite border border-opel-border text-xs text-opel-silver hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-opel-lime text-black font-bold text-xs hover:shadow-lime-glow"
                >
                  Save to Garage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
