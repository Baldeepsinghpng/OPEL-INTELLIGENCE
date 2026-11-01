'use client';

import React, { useState } from 'react';
import { useVehicle } from '@/context/VehicleContext';
import { OPEL_VEHICLES } from '@/data/vehicles';
import { VehicleSpec } from '@/types/vehicle';
import { formatKm, formatEur, formatSpeed } from '@/lib/utils';
import { 
  Compass, 
  Zap, 
  Gauge, 
  BatteryCharging, 
  SlidersHorizontal, 
  ExternalLink, 
  Info, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles
} from 'lucide-react';

export default function ExplorerPage() {
  const { useImperial, setActiveVehicleId, userVehicles, addUserVehicle } = useVehicle();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(OPEL_VEHICLES[0].id);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareIds, setCompareIds] = useState<string[]>([OPEL_VEHICLES[0].id, OPEL_VEHICLES[1].id]);
  const [filterPowertrain, setFilterPowertrain] = useState<string>('All');

  const selectedVehicle = OPEL_VEHICLES.find((v) => v.id === selectedVehicleId) || OPEL_VEHICLES[0];

  const filteredVehicles = filterPowertrain === 'All'
    ? OPEL_VEHICLES
    : OPEL_VEHICLES.filter((v) => v.powertrain === filterPowertrain);

  const toggleCompareVehicle = (id: string) => {
    if (compareIds.includes(id)) {
      if (compareIds.length > 1) {
        setCompareIds(compareIds.filter((item) => item !== id));
      }
    } else {
      if (compareIds.length < 3) {
        setCompareIds([...compareIds, id]);
      } else {
        setCompareIds([compareIds[1], compareIds[2], id]);
      }
    }
  };

  const handleAddToGarage = (spec: VehicleSpec) => {
    addUserVehicle({
      specId: spec.id,
      customName: `My ${spec.name}`,
      vinMasked: `W0L0000••••••${Math.floor(1000 + Math.random() * 9000)}`,
      licensePlate: `GG-OP ${Math.floor(100 + Math.random() * 900)}E`,
      colorName: 'Diamond Black with Lime Vizor',
      deliveryDate: new Date().toISOString().split('T')[0],
      odometerKm: 1200,
      currentSocPercent: 85,
      batteryHealthSoHPercent: 100,
      isCharging: false,
      chargingRateKw: 0,
      isLocked: true,
      climatePreconditioningActive: false,
      targetCabinTempC: 21.0,
      currentCabinTempC: 20.0,
      tirePressureBar: {
        frontLeft: 2.5,
        frontRight: 2.5,
        rearLeft: 2.4,
        rearRight: 2.4,
        recommendedBar: 2.5,
      },
      auxiliaryBatteryVoltage: 12.9,
      softwareVersion: 'PureConnect 2.1-OTA',
    });
    alert(`Added ${spec.name} to My Garage fleet!`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-opel-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-opel-lime text-black">
              <Compass className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Vehicle Explorer
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-opel-lime/20 text-opel-lime border border-opel-lime/40">
              European Electrified Lineup
            </span>
          </div>
          <p className="text-xs text-opel-silver mt-1">
            Explore verified specifications, architecture platforms, and technological innovations across modern Opel vehicles.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setCompareMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              !compareMode
                ? 'bg-opel-lime text-black shadow-lime-glow-sm'
                : 'bg-opel-carbon border border-opel-border text-opel-silver hover:text-white'
            }`}
          >
            Detailed Model View
          </button>
          <button
            onClick={() => setCompareMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              compareMode
                ? 'bg-opel-lime text-black shadow-lime-glow-sm'
                : 'bg-opel-carbon border border-opel-border text-opel-silver hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare Matrix ({compareIds.length})</span>
          </button>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredVehicles.map((veh) => {
          const isSelected = selectedVehicleId === veh.id;
          const isCompared = compareIds.includes(veh.id);

          return (
            <button
              key={veh.id}
              onClick={() => {
                setSelectedVehicleId(veh.id);
                if (compareMode) toggleCompareVehicle(veh.id);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected && !compareMode
                  ? 'bg-opel-graphite border border-opel-lime text-white shadow-lime-glow-sm'
                  : compareMode && isCompared
                  ? 'bg-opel-lime/20 border border-opel-lime text-opel-lime'
                  : 'bg-opel-carbon border border-opel-border text-opel-silver hover:text-white hover:bg-opel-graphite'
              }`}
            >
              <span>{veh.name}</span>
              <span className="text-[10px] font-mono opacity-80">
                ({veh.wltpRangeKm} km)
              </span>
              {compareMode && isCompared && (
                <Check className="w-3.5 h-3.5 text-opel-lime" />
              )}
            </button>
          );
        })}
      </div>

      {!compareMode ? (
        /* DETAILED SINGLE MODEL VIEW */
        <div className="space-y-6">
          <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 lg:p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Visual Presentation */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-opel-border shadow-2xl">
                  <img
                    src={selectedVehicle.heroImage}
                    alt={selectedVehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-opel-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-opel-black/80 backdrop-blur-md text-[11px] font-mono text-opel-lime border border-opel-border/60">
                    Platform: {selectedVehicle.platform}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToGarage(selectedVehicle)}
                    className="flex-1 py-2.5 rounded-xl bg-opel-lime text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:shadow-lime-glow transition-all"
                  >
                    <span>Add to My Garage Fleet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={selectedVehicle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl bg-opel-graphite border border-opel-border text-xs text-opel-silver hover:text-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Key Specifications */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-opel-lime">
                      {selectedVehicle.category}
                    </span>
                    <span className="text-xs text-opel-silver">•</span>
                    <span className="text-xs font-mono text-opel-silver">Model Year {selectedVehicle.modelYear}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white font-display mt-0.5">
                    {selectedVehicle.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-opel-silver mt-1 leading-relaxed">
                    {selectedVehicle.tagline}
                  </p>
                </div>

                {/* Primary Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border">
                    <div className="text-[10px] text-opel-silver font-mono">WLTP Range</div>
                    <div className="text-lg font-black text-white font-display mt-0.5">
                      {formatKm(selectedVehicle.wltpRangeKm, useImperial)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border">
                    <div className="text-[10px] text-opel-silver font-mono">Usable Battery</div>
                    <div className="text-lg font-black text-white font-display mt-0.5">
                      {selectedVehicle.batteryCapacityNetKwh || selectedVehicle.batteryCapacityGrossKwh} kWh
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border">
                    <div className="text-[10px] text-opel-silver font-mono">Max DC Charging</div>
                    <div className="text-lg font-black text-opel-lime font-display mt-0.5">
                      {selectedVehicle.maxDcChargingPowerKw} kW
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border">
                    <div className="text-[10px] text-opel-silver font-mono">Power Output</div>
                    <div className="text-lg font-black text-white font-display mt-0.5">
                      {selectedVehicle.powerHp} hp ({selectedVehicle.powerKw} kW)
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border">
                    <div className="text-[10px] text-opel-silver font-mono">0-100 km/h</div>
                    <div className="text-lg font-black text-white font-display mt-0.5">
                      {selectedVehicle.acceleration0To100Kmh} s
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border">
                    <div className="text-[10px] text-opel-silver font-mono">Base Price (DE)</div>
                    <div className="text-lg font-black text-white font-display mt-0.5">
                      {formatEur(selectedVehicle.basePriceEur)}
                    </div>
                  </div>
                </div>

                {/* Key Features Bullet List */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] uppercase font-mono tracking-wider text-opel-silver/70">
                    Distinguishing Engineering Features:
                  </div>
                  <div className="space-y-1.5">
                    {selectedVehicle.keyFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-opel-light">
                        <Check className="w-3.5 h-3.5 text-opel-lime shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Public Source Verification Footer */}
            <div className="mt-8 pt-4 border-t border-opel-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-opel-silver">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-opel-lime" />
                <span>Verified Public Reference: {selectedVehicle.sourceNote}</span>
              </div>
              <a
                href={selectedVehicle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-opel-lime hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>Stellantis European Press Archive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* COMPARISON MATRIX MODE */
        <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-opel-border/60 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Scale className="w-5 h-5 text-opel-lime" />
                <span>Side-by-Side Comparison Matrix</span>
              </h2>
              <p className="text-xs text-opel-silver font-mono">
                Select up to 3 vehicles to compare architecture, performance, and charging metrics.
              </p>
            </div>
            <span className="text-xs text-opel-lime font-mono">
              Comparing {compareIds.length} Models
            </span>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-opel-border">
                  <th className="py-3 px-4 font-mono text-opel-silver uppercase w-48">Specification</th>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    if (!car) return null;
                    return (
                      <th key={car.id} className="py-3 px-4 font-display text-white text-sm font-bold min-w-[200px]">
                        <div>{car.name}</div>
                        <div className="text-[11px] font-mono text-opel-lime font-normal">
                          {formatEur(car.basePriceEur)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-opel-border/50 font-mono">
                <tr>
                  <td className="py-3 px-4 text-opel-silver">Powertrain</td>
                  {compareIds.map((id) => (
                    <td key={id} className="py-3 px-4 font-bold text-white">
                      {OPEL_VEHICLES.find((v) => v.id === id)?.powertrain}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-opel-silver">WLTP Range</td>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    return (
                      <td key={id} className="py-3 px-4 font-bold text-opel-lime">
                        {car ? formatKm(car.wltpRangeKm, useImperial) : '-'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-opel-silver">Battery (Net / Gross)</td>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-white">
                        {car?.batteryCapacityNetKwh || car?.batteryCapacityGrossKwh} kWh
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-opel-silver">Max DC Fast Charge</td>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-white">
                        {car?.maxDcChargingPowerKw} kW DC
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-opel-silver">Power (hp / kW)</td>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-white">
                        {car?.powerHp} hp ({car?.powerKw} kW)
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-opel-silver">Torque</td>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-white">
                        {car?.torqueNm} Nm
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-opel-silver">Acceleration (0-100)</td>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-white">
                        {car?.acceleration0To100Kmh} s
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-opel-silver">Top Speed</td>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-white">
                        {car ? formatSpeed(car.topSpeedKmh, useImperial) : '-'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-opel-silver">Trunk / Boot Volume</td>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-white">
                        {car?.bootCapacityLiters} Liters
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-opel-silver">Platform Architecture</td>
                  {compareIds.map((id) => {
                    const car = OPEL_VEHICLES.find((v) => v.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-opel-silver">
                        {car?.platform}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
