import { VehicleSpec, EVTripSimulationParams, EVTripSimulationResult } from '@/types/vehicle';

/**
 * Calculates physics-grounded EV trip consumption, charging stops and battery depletion
 */
export function simulateEVTrip(
  vehicle: VehicleSpec,
  params: EVTripSimulationParams
): EVTripSimulationResult {
  const baseEfficiency = vehicle.wltpEfficiencyKwhPer100Km || 15.0; // kWh/100km
  const batteryCapacity = vehicle.batteryCapacityNetKwh || (vehicle.batteryCapacityGrossKwh ? vehicle.batteryCapacityGrossKwh * 0.94 : 50);

  // 1. Temperature Impact
  // Optimum temperature ~21°C
  let tempFactor = 1.0;
  const tempDiff = params.ambientTemperatureC - 21;
  if (params.ambientTemperatureC < 21) {
    // Cold weather penalty: ~1.2% per degree below 21°C down to 0°C, and 1.8% per degree below 0°C
    if (params.ambientTemperatureC >= 0) {
      tempFactor += Math.abs(tempDiff) * 0.012;
    } else {
      tempFactor += 21 * 0.012 + Math.abs(params.ambientTemperatureC) * 0.018;
    }
  } else {
    // Hot weather penalty (AC cooling): ~0.8% per degree above 21°C
    tempFactor += tempDiff * 0.008;
  }

  // Cabin HVAC active addition
  if (params.hvacActive) {
    tempFactor += 0.05; // 5% base HVAC compressor continuous circulation
  }

  // 2. Speed / Highway Impact (Aero Drag)
  // Highway percentage: 0% = pure city/mixed (factor 0.95), 100% = 120-130 km/h cruising (factor 1.35)
  const speedFactor = 0.95 + (params.highwayPercentage / 100) * 0.40;

  // 3. Driving Style
  let styleFactor = 1.0;
  if (params.drivingStyle === 'Eco') styleFactor = 0.92;
  if (params.drivingStyle === 'Dynamic') styleFactor = 1.15;

  // 4. Payload Impact
  // ~1.8% increase per 100kg of passengers/cargo
  const payloadFactor = 1.0 + (params.cargoWeightKg / 100) * 0.018;

  // Calculate final consumption per 100km
  const totalFactor = tempFactor * speedFactor * styleFactor * payloadFactor;
  const simulatedConsumption = Number((baseEfficiency * totalFactor).toFixed(1));

  // Total energy required for distance
  const totalEnergyNeededKwh = (params.distanceKm / 100) * simulatedConsumption;

  // Initial available energy from starting SoC
  const initialAvailableEnergyKwh = (params.initialSocPercent / 100) * batteryCapacity;

  // Remaining energy
  const remainingEnergyKwh = initialAvailableEnergyKwh - totalEnergyNeededKwh;

  let arrivalSocPercent = Math.round((remainingEnergyKwh / batteryCapacity) * 100);
  let chargingStopsNeeded = 0;
  let suggestedChargeDurationMinutes = 0;

  if (arrivalSocPercent < 10) {
    // Needs at least one charging stop
    const energyDeficit = 10 * (batteryCapacity / 100) - remainingEnergyKwh;
    chargingStopsNeeded = Math.ceil(energyDeficit / (batteryCapacity * 0.70));
    
    // Fast charging calculation (e.g. 10% to 80% at max DC power with taper)
    const avgDcRateKw = vehicle.maxDcChargingPowerKw ? vehicle.maxDcChargingPowerKw * 0.75 : 75;
    const energyToTopUpKwh = energyDeficit + (batteryCapacity * 0.2); // arrive with 20% buffer
    suggestedChargeDurationMinutes = Math.round((energyToTopUpKwh / avgDcRateKw) * 60);
    arrivalSocPercent = 20; // Arrives with safe reserve after charging
  }

  const remainingRangeKm = arrivalSocPercent > 0 
    ? Math.round(((arrivalSocPercent / 100) * batteryCapacity / simulatedConsumption) * 100)
    : 0;

  return {
    estimatedConsumptionKwhPer100Km: simulatedConsumption,
    totalEnergyUsedKwh: Number(totalEnergyNeededKwh.toFixed(1)),
    arrivalSocPercent: Math.max(0, arrivalSocPercent),
    estimatedRemainingRangeAtArrivalKm: remainingRangeKm,
    chargingStopsNeeded,
    suggestedChargeDurationMinutes: chargingStopsNeeded > 0 ? suggestedChargeDurationMinutes : undefined,
    weatherImpactPercent: Math.round((tempFactor - 1.0) * 100),
    speedImpactPercent: Math.round((speedFactor - 1.0) * 100),
    payloadImpactPercent: Math.round((payloadFactor - 1.0) * 100),
  };
}

/**
 * Calculates charging time from start% to target% across various charger types
 */
export function calculateChargingTimes(
  batteryCapacityKwh: number,
  maxVehicleDcKw: number = 100,
  maxVehicleAcKw: number = 11,
  startPercent: number = 20,
  targetPercent: number = 80
) {
  const energyNeededKwh = ((targetPercent - startPercent) / 100) * batteryCapacityKwh;

  // 1. Domestic Schuko Socket 2.3 kW (230V, 10A, 85% efficiency)
  const homeSchukoHours = energyNeededKwh / (2.3 * 0.85);

  // 2. Home Wallbox Single Phase 7.4 kW (90% efficiency)
  const wallbox74Hours = energyNeededKwh / (Math.min(7.4, maxVehicleAcKw) * 0.90);

  // 3. Three-Phase AC Wallbox / Destination 11 kW (92% efficiency)
  const wallbox11Hours = energyNeededKwh / (Math.min(11, maxVehicleAcKw) * 0.92);

  // 4. DC Fast Charger 50 kW
  const dc50Hours = energyNeededKwh / (Math.min(50, maxVehicleDcKw) * 0.90);

  // 5. Ultra-Fast High Power Charger (e.g. 150 kW - 300 kW, limited by vehicle max DC)
  // DC curve taper: 10-80% is fast, 80-100% drops down significantly
  let effectiveDcKw = maxVehicleDcKw;
  if (targetPercent > 80) {
    // Tapering above 80% to protect NMC / LFP cells
    effectiveDcKw = maxVehicleDcKw * 0.55;
  }
  const ultraDcHours = energyNeededKwh / (effectiveDcKw * 0.88);

  const formatMins = (hours: number) => {
    const totalMinutes = Math.round(hours * 60);
    if (totalMinutes >= 60) {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${totalMinutes} min`;
  };

  return [
    {
      name: 'Household Socket (Schuko)',
      power: '2.3 kW AC',
      duration: formatMins(homeSchukoHours),
      minutes: Math.round(homeSchukoHours * 60),
      type: 'Home AC',
      efficiency: '85%',
    },
    {
      name: 'Home Wallbox (1-Phase)',
      power: '7.4 kW AC',
      duration: formatMins(wallbox74Hours),
      minutes: Math.round(wallbox74Hours * 60),
      type: 'Home AC',
      efficiency: '90%',
    },
    {
      name: 'Public / Garage Wallbox (3-Phase)',
      power: `${Math.min(11, maxVehicleAcKw)} kW AC`,
      duration: formatMins(wallbox11Hours),
      minutes: Math.round(wallbox11Hours * 60),
      type: 'Public AC',
      efficiency: '92%',
    },
    {
      name: 'Standard Rapid DC Charger',
      power: '50 kW DC',
      duration: formatMins(dc50Hours),
      minutes: Math.round(dc50Hours * 60),
      type: 'DC Fast',
      efficiency: '90%',
    },
    {
      name: 'High-Power HPC Charger',
      power: `Up to ${maxVehicleDcKw} kW DC`,
      duration: formatMins(ultraDcHours),
      minutes: Math.round(ultraDcHours * 60),
      type: 'HPC DC',
      efficiency: '88%',
    },
  ];
}
