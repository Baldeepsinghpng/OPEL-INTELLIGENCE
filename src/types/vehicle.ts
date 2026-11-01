export type PowertrainType = 'BEV' | 'PHEV' | 'ICE';

export interface VehicleSpec {
  id: string;
  name: string;
  tagline: string;
  modelYear: number;
  powertrain: PowertrainType;
  category: 'Compact Hatchback' | 'Station Wagon' | 'Compact SUV' | 'Mid-Size SUV' | 'Urban Mobility';
  platform: string;
  batteryCapacityGrossKwh?: number;
  batteryCapacityNetKwh?: number;
  wltpRangeKm: number;
  wltpEfficiencyKwhPer100Km?: number;
  maxDcChargingPowerKw?: number;
  maxAcChargingPowerKw: number;
  fastChargeTimeMinutes10To80?: number;
  powerHp: number;
  powerKw: number;
  torqueNm: number;
  acceleration0To100Kmh: number;
  topSpeedKmh: number;
  bootCapacityLiters: number;
  kerbWeightKg: number;
  basePriceEur: number;
  heroImage: string;
  galleryImages: string[];
  keyFeatures: string[];
  sourceUrl: string;
  sourceNote: string;
}

export interface UserVehicle {
  id: string;
  specId: string;
  customName: string;
  vinMasked: string;
  licensePlate: string;
  colorName: string;
  deliveryDate: string;
  odometerKm: number;
  currentSocPercent: number; // State of charge 0-100%
  batteryHealthSoHPercent: number; // State of health
  isCharging: boolean;
  chargingRateKw?: number;
  isLocked: boolean;
  climatePreconditioningActive: boolean;
  targetCabinTempC: number;
  currentCabinTempC: number;
  tirePressureBar: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
    recommendedBar: number;
  };
  auxiliaryBatteryVoltage: number;
  lastSyncTimestamp: string;
  softwareVersion: string;
}

export type MaintenanceUrgency = 'good' | 'due-soon' | 'overdue';

export interface MaintenanceItem {
  id: string;
  title: string;
  intervalKm: number;
  intervalMonths: number;
  category: 'Inspection' | 'Fluid' | 'Filter' | 'Safety' | 'High-Voltage System';
  description: string;
  educationalNote: string;
  officialRef: string;
  estimatedCostEur: number;
  lastPerformedKm?: number;
  lastPerformedDate?: string;
  status: MaintenanceUrgency;
}

export interface ServiceRecord {
  id: string;
  date: string;
  odometerKm: number;
  title: string;
  workshopName: string;
  costEur: number;
  itemsServiced: string[];
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
  suggestedFollowUps?: string[];
  status?: 'sending' | 'complete' | 'error';
}

export interface EVTripSimulationParams {
  distanceKm: number;
  highwayPercentage: number;
  ambientTemperatureC: number;
  hvacActive: boolean;
  targetCabinTempC: number;
  drivingStyle: 'Eco' | 'Balanced' | 'Dynamic';
  cargoWeightKg: number;
  initialSocPercent: number;
}

export interface EVTripSimulationResult {
  estimatedConsumptionKwhPer100Km: number;
  totalEnergyUsedKwh: number;
  arrivalSocPercent: number;
  estimatedRemainingRangeAtArrivalKm: number;
  chargingStopsNeeded: number;
  suggestedChargeDurationMinutes?: number;
  weatherImpactPercent: number;
  speedImpactPercent: number;
  payloadImpactPercent: number;
}
