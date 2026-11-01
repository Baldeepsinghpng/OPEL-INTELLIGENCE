'use client';

import React, { useState } from 'react';
import { useVehicle } from '@/context/VehicleContext';
import { simulateEVTrip, calculateChargingTimes } from '@/lib/ev-calculator';
import { formatKm, formatEur, formatTemp } from '@/lib/utils';
import { 
  BatteryCharging, 
  Zap, 
  Sliders, 
  Thermometer, 
  Wind, 
  Navigation, 
  Fuel, 
  PiggyBank, 
  Info, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Gauge
} from 'lucide-react';

export default function EVCompanionPage() {
  const { activeVehicle, activeSpec, useImperial } = useVehicle();

  // Interactive Simulator Parameters
  const [distanceKm, setDistanceKm] = useState<number>(240);
  const [highwayPercentage, setHighwayPercentage] = useState<number>(65);
  const [ambientTempC, setAmbientTempC] = useState<number>(10);
  const [hvacActive, setHvacActive] = useState<boolean>(true);
  const [cargoWeightKg, setCargoWeightKg] = useState<number>(150);
  const [drivingStyle, setDrivingStyle] = useState<'Eco' | 'Balanced' | 'Dynamic'>('Balanced');

  // Charging Cost Calculator Parameters
  const [homeTariffEurPerKwh, setHomeTariffEurPerKwh] = useState<number>(0.32);
  const [publicAcTariffEurPerKwh, setPublicAcTariffEurPerKwh] = useState<number>(0.46);
  const [hpcDcTariffEurPerKwh, setHpcDcTariffEurPerKwh] = useState<number>(0.69);
  const [annualMileageKm, setAnnualMileageKm] = useState<number>(18000);
  const [petrolPriceEurPerLiter, setPetrolPriceEurPerLiter] = useState<number>(1.82);

  // Run Physics Simulation
  const tripResult = simulateEVTrip(activeSpec, {
    distanceKm,
    highwayPercentage,
    ambientTemperatureC: ambientTempC,
    hvacActive,
    targetCabinTempC: activeVehicle.targetCabinTempC,
    drivingStyle,
    cargoWeightKg,
    initialSocPercent: activeVehicle.currentSocPercent,
  });

  // Calculate Charging Durations
  const batteryCap = activeSpec.batteryCapacityNetKwh || (activeSpec.batteryCapacityGrossKwh ? activeSpec.batteryCapacityGrossKwh * 0.94 : 51);
  const chargingOptions = calculateChargingTimes(
    batteryCap,
    activeSpec.maxDcChargingPowerKw || 100,
    activeSpec.maxAcChargingPowerKw || 11,
    20,
    80
  );

  // Financial Cost Calculations
  const evCostPer100KmHome = (tripResult.estimatedConsumptionKwhPer100Km * homeTariffEurPerKwh);
  const evCostPer100KmPublicMixed = (tripResult.estimatedConsumptionKwhPer100Km * ((homeTariffEurPerKwh * 0.6) + (hpcDcTariffEurPerKwh * 0.4)));
  const equivalentIceCostPer100Km = 6.8 * petrolPriceEurPerLiter; // ~6.8L/100km for a compact petrol hatch/SUV
  const annualSavingsEur = Math.round(
    ((equivalentIceCostPer100Km - evCostPer100KmPublicMixed) / 100) * annualMileageKm
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-opel-border">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-opel-lime text-black">
            <BatteryCharging className="w-4 h-4" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            EV Companion & Range Simulator
          </h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-opel-lime/20 text-opel-lime border border-opel-lime/40">
            Physics-Grounded Simulation
          </span>
        </div>
        <p className="text-xs text-opel-silver mt-1">
          Predict highway energy consumption, calculate charging stop times, and model fuel savings based on German and European driving conditions.
        </p>
      </div>

      {/* Main Trip Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Simulation Sliders */}
        <div className="lg:col-span-7 rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-opel-border/60">
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Sliders className="w-4 h-4 text-opel-lime" />
              <span>Trip Scenario Inputs</span>
            </h2>
            <span className="text-xs text-opel-silver font-mono">
              Vehicle: {activeSpec.name} ({activeVehicle.currentSocPercent}% SoC Start)
            </span>
          </div>

          {/* Slider 1: Distance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-opel-silver flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-opel-lime" />
                Planned Route Distance:
              </span>
              <span className="text-sm font-bold text-white">
                {formatKm(distanceKm, useImperial)}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="650"
              step="10"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-opel-lime bg-opel-graphite h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-opel-silver font-mono">
              <span>{formatKm(20, useImperial)}</span>
              <span>{formatKm(300, useImperial)}</span>
              <span>{formatKm(650, useImperial)}</span>
            </div>
          </div>

          {/* Slider 2: Highway Percentage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-opel-silver flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-blue-400" />
                Highway / Autobahn Ratio:
              </span>
              <span className="text-sm font-bold text-white">
                {highwayPercentage}% (120–130 km/h)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={highwayPercentage}
              onChange={(e) => setHighwayPercentage(Number(e.target.value))}
              className="w-full accent-blue-400 bg-opel-graphite h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-opel-silver font-mono">
              <span>0% (City / Rural)</span>
              <span>50% (Mixed)</span>
              <span>100% (Pure Autobahn)</span>
            </div>
          </div>

          {/* Slider 3: Ambient Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-opel-silver flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Ambient Temperature:
              </span>
              <span className="text-sm font-bold text-white">
                {formatTemp(ambientTempC, useImperial)}
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="40"
              step="1"
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(Number(e.target.value))}
              className="w-full accent-amber-400 bg-opel-graphite h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-opel-silver font-mono">
              <span>-15°C (Winter Freeze)</span>
              <span>21°C (Optimum WLTP)</span>
              <span>40°C (Summer Heat)</span>
            </div>
          </div>

          {/* Toggles & Selectors Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* HVAC Heat Pump Toggle */}
            <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border">
              <div className="text-[11px] font-mono text-opel-silver mb-1.5">Cabin Heat Pump</div>
              <button
                onClick={() => setHvacActive(!hvacActive)}
                className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  hvacActive
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                    : 'bg-opel-carbon text-opel-silver border border-opel-border'
                }`}
              >
                {hvacActive ? 'Active (21°C)' : 'Eco / Off'}
              </button>
            </div>

            {/* Driving Style */}
            <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border">
              <div className="text-[11px] font-mono text-opel-silver mb-1.5">Driving Style</div>
              <div className="grid grid-cols-3 gap-1">
                {(['Eco', 'Balanced', 'Dynamic'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setDrivingStyle(style)}
                    className={`py-1 rounded text-[10px] font-mono font-bold transition-all ${
                      drivingStyle === style
                        ? 'bg-opel-lime text-black shadow-lime-glow-sm'
                        : 'bg-opel-carbon text-opel-silver'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Payload Weight */}
            <div className="p-3 rounded-xl bg-opel-graphite/60 border border-opel-border">
              <div className="text-[11px] font-mono text-opel-silver mb-1.5">
                Payload: {cargoWeightKg} kg
              </div>
              <input
                type="range"
                min="0"
                max="400"
                step="25"
                value={cargoWeightKg}
                onChange={(e) => setCargoWeightKg(Number(e.target.value))}
                className="w-full accent-opel-lime bg-opel-carbon h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Simulation Results & Battery Arrival State */}
        <div className="lg:col-span-5 rounded-2xl border border-opel-lime/40 bg-gradient-to-br from-opel-carbon via-opel-graphite to-opel-carbon p-6 shadow-lime-glow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-opel-border/60">
              <span className="text-xs font-mono uppercase tracking-wider text-opel-lime font-bold">
                Simulation Projection
              </span>
              <span className="text-[10px] font-mono bg-opel-black/60 px-2 py-0.5 rounded text-opel-silver border border-opel-border">
                Estimate Only
              </span>
            </div>

            {/* Projected Consumption Metric */}
            <div className="py-6 space-y-4">
              <div>
                <div className="text-xs text-opel-silver font-mono">Projected Energy Consumption</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white font-display">
                    {tripResult.estimatedConsumptionKwhPer100Km}
                  </span>
                  <span className="text-sm font-mono text-opel-lime">kWh / 100 km</span>
                </div>
                <div className="text-xs text-opel-silver font-mono mt-1">
                  Factory WLTP Baseline: {activeSpec.wltpEfficiencyKwhPer100Km} kWh/100km
                </div>
              </div>

              {/* Arrival Battery SoC */}
              <div className="p-4 rounded-xl bg-opel-black/70 border border-opel-border space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-opel-silver">Arrival State of Charge:</span>
                  <span
                    className={`font-bold ${
                      tripResult.arrivalSocPercent > 15 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {tripResult.arrivalSocPercent}% SoC
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-opel-graphite overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tripResult.arrivalSocPercent > 15
                        ? 'bg-gradient-to-r from-emerald-500 to-opel-lime'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, tripResult.arrivalSocPercent))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-opel-silver font-mono pt-1">
                  <span>Remaining Range: {formatKm(tripResult.estimatedRemainingRangeAtArrivalKm, useImperial)}</span>
                  <span>Total Energy: {tripResult.totalEnergyUsedKwh} kWh</span>
                </div>
              </div>

              {/* Charging Stop Recommendation */}
              {tripResult.chargingStopsNeeded > 0 ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Requires {tripResult.chargingStopsNeeded} Fast Charging Stop</span>
                  </div>
                  <p className="text-[11px] text-opel-silver leading-relaxed">
                    Recommended stop: ~{tripResult.suggestedChargeDurationMinutes} mins at a 100+ kW CCS charger along your route to arrive with safe 20% reserve.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Route Feasible: No mid-trip charging stop needed!</span>
                </div>
              )}

              {/* Physical Impact Factor Breakdown */}
              <div className="pt-2">
                <div className="text-[10px] uppercase font-mono tracking-wider text-opel-silver/70 mb-2">
                  Aerodynamic & Thermal Factor Variance:
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-opel-graphite/40 border border-opel-border">
                    <div className="text-[10px] text-opel-silver">Speed</div>
                    <div className="font-bold text-white">+{tripResult.speedImpactPercent}%</div>
                  </div>
                  <div className="p-2 rounded bg-opel-graphite/40 border border-opel-border">
                    <div className="text-[10px] text-opel-silver">Climate</div>
                    <div className="font-bold text-white">{tripResult.weatherImpactPercent > 0 ? `+${tripResult.weatherImpactPercent}%` : '0%'}</div>
                  </div>
                  <div className="p-2 rounded bg-opel-graphite/40 border border-opel-border">
                    <div className="text-[10px] text-opel-silver">Payload</div>
                    <div className="font-bold text-white">+{tripResult.payloadImpactPercent}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-opel-border/60 text-[10px] text-opel-silver/70 font-mono">
            *Estimates are calculated using physical drag & thermodynamic models. Live availability of chargers requires third-party live roaming data.
          </div>
        </div>
      </div>

      {/* Charging Duration Matrix Across Protocols */}
      <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-opel-border/60 gap-2">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Clock className="w-4 h-4 text-opel-lime" />
              <span>Charging Duration Matrix (20% &rarr; 80% Replenishment)</span>
            </h2>
            <p className="text-xs text-opel-silver font-mono">
              Tested on {activeSpec.name} ({batteryCap} kWh Pack)
            </p>
          </div>
          <span className="text-xs text-opel-lime font-mono">
            Max Vehicle DC Acceptance: {activeSpec.maxDcChargingPowerKw} kW
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {chargingOptions.map((opt, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                opt.type === 'HPC DC'
                  ? 'border-opel-lime/40 bg-gradient-to-b from-opel-lime/10 to-opel-graphite'
                  : 'border-opel-border bg-opel-graphite/60'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-opel-silver px-1.5 py-0.5 rounded bg-opel-carbon border border-opel-border">
                  {opt.type}
                </span>
                <div className="text-xs font-bold text-white mt-2 leading-tight">
                  {opt.name}
                </div>
                <div className="text-xs font-mono text-opel-silver mt-0.5">{opt.power}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-opel-border/50">
                <div className="text-xl font-black text-white font-display">
                  {opt.duration}
                </div>
                <div className="text-[10px] text-opel-silver font-mono">Efficiency: {opt.efficiency}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charging Cost & Energy Savings Calculator */}
      <div className="rounded-2xl border border-opel-border bg-opel-carbon p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-opel-border/60 gap-2">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-400" />
              <span>Energy Cost & Fuel Savings Calculator</span>
            </h2>
            <p className="text-xs text-opel-silver font-mono">
              Compare electricity charging costs with equivalent European petrol/diesel expenditures.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-opel-silver font-mono">Projected Annual Savings</span>
            <div className="text-xl font-black text-emerald-400 font-display">
              +{formatEur(annualSavingsEur)} / year
            </div>
          </div>
        </div>

        {/* Cost Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Home Night Tariff */}
          <div className="p-4 rounded-xl bg-opel-graphite/60 border border-opel-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Home Night Wallbox</span>
              <span className="text-xs font-mono text-opel-lime">€{homeTariffEurPerKwh.toFixed(2)}/kWh</span>
            </div>
            <div className="text-2xl font-black text-white font-display">
              {formatEur(evCostPer100KmHome)} <span className="text-xs text-opel-silver font-normal">/ 100 km</span>
            </div>
            <p className="text-[11px] text-opel-silver leading-relaxed">
              Based on {tripResult.estimatedConsumptionKwhPer100Km} kWh/100km consumption overnight at domestic residential tariff.
            </p>
          </div>

          {/* Mixed Public & HPC Fast Charging */}
          <div className="p-4 rounded-xl bg-opel-graphite/60 border border-opel-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Mixed Urban + Ionity DC</span>
              <span className="text-xs font-mono text-opel-lime">60% Home / 40% DC</span>
            </div>
            <div className="text-2xl font-black text-white font-display">
              {formatEur(evCostPer100KmPublicMixed)} <span className="text-xs text-opel-silver font-normal">/ 100 km</span>
            </div>
            <p className="text-[11px] text-opel-silver leading-relaxed">
              Blended real-world scenario combining home charging with highway high-power DC charging stops.
            </p>
          </div>

          {/* Equivalent Combustion Engine */}
          <div className="p-4 rounded-xl bg-opel-graphite/60 border border-opel-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Equivalent Petrol Car (6.8L)</span>
              <span className="text-xs font-mono text-amber-400">€{petrolPriceEurPerLiter.toFixed(2)}/L</span>
            </div>
            <div className="text-2xl font-black text-amber-400 font-display">
              {formatEur(equivalentIceCostPer100Km)} <span className="text-xs text-opel-silver font-normal">/ 100 km</span>
            </div>
            <p className="text-[11px] text-opel-silver leading-relaxed">
              European average consumption for a C-segment compact petrol hatchback running on Super 95.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
