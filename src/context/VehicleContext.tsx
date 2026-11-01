'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { VehicleSpec, UserVehicle, MaintenanceItem, ServiceRecord } from '@/types/vehicle';
import { OPEL_VEHICLES, DEFAULT_MAINTENANCE_SCHEDULE } from '@/data/vehicles';

interface VehicleContextType {
  vehicles: VehicleSpec[];
  userVehicles: UserVehicle[];
  activeVehicle: UserVehicle;
  activeSpec: VehicleSpec;
  maintenanceItems: MaintenanceItem[];
  serviceHistory: ServiceRecord[];
  useImperial: boolean;
  setUseImperial: (val: boolean) => void;
  setActiveVehicleId: (id: string) => void;
  addUserVehicle: (vehicle: Omit<UserVehicle, 'id' | 'lastSyncTimestamp'>) => void;
  deleteUserVehicle: (id: string) => void;
  toggleLock: () => void;
  toggleClimate: () => void;
  setTargetTemp: (temp: number) => void;
  toggleCharging: () => void;
  setSoc: (soc: number) => void;
  logServiceRecord: (record: Omit<ServiceRecord, 'id'>) => void;
  refreshTelemetry: () => void;
}

const DEFAULT_USER_VEHICLES: UserVehicle[] = [
  {
    id: 'uv-1',
    specId: 'opel-astra-electric',
    customName: 'Astra e-First Edition',
    vinMasked: 'W0L0000••••••4821',
    licensePlate: 'GG-OP 2024E', // GG = Gross-Gerau / Rüsselsheim (Opel home)
    colorName: 'Kult Yellow with Diamond Black Roof',
    deliveryDate: '2024-03-15',
    odometerKm: 14850,
    currentSocPercent: 78,
    batteryHealthSoHPercent: 99,
    isCharging: false,
    chargingRateKw: 0,
    isLocked: true,
    climatePreconditioningActive: false,
    targetCabinTempC: 21.5,
    currentCabinTempC: 19.0,
    tirePressureBar: {
      frontLeft: 2.5,
      frontRight: 2.5,
      rearLeft: 2.4,
      rearRight: 2.4,
      recommendedBar: 2.5,
    },
    auxiliaryBatteryVoltage: 12.8,
    lastSyncTimestamp: new Date().toISOString(),
    softwareVersion: 'IntelliLink 4.1.8-OTA',
  },
  {
    id: 'uv-2',
    specId: 'opel-grandland-electric',
    customName: 'Grandland Executive Long Range',
    vinMasked: 'W0L0000••••••9340',
    licensePlate: 'GG-EX 9800E',
    colorName: 'Impact Bronze with Black Vizor',
    deliveryDate: '2025-01-10',
    odometerKm: 3420,
    currentSocPercent: 91,
    batteryHealthSoHPercent: 100,
    isCharging: true,
    chargingRateKw: 11.0,
    isLocked: true,
    climatePreconditioningActive: true,
    targetCabinTempC: 22.0,
    currentCabinTempC: 21.0,
    tirePressureBar: {
      frontLeft: 2.6,
      frontRight: 2.6,
      rearLeft: 2.5,
      rearRight: 2.5,
      recommendedBar: 2.6,
    },
    auxiliaryBatteryVoltage: 13.1,
    lastSyncTimestamp: new Date().toISOString(),
    softwareVersion: 'STLA SmartOS 2.0.4',
  },
];

const INITIAL_SERVICE_HISTORY: ServiceRecord[] = [
  {
    id: 'sr-1',
    date: '2024-09-12',
    odometerKm: 12500,
    title: '6-Month Seasonal Safety Check & Software Calibration',
    workshopName: 'Autohaus Rüsselsheim Opel Partner',
    costEur: 85,
    itemsServiced: ['High-voltage insulation test', 'Tire rotation & alignment check', 'Pure Panel firmware 4.1.8 update'],
    notes: 'All traction cell module balancing within 8mV variance. Battery health excellent.',
  },
];

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles] = useState<VehicleSpec[]>(OPEL_VEHICLES);
  const [userVehicles, setUserVehicles] = useState<UserVehicle[]>(DEFAULT_USER_VEHICLES);
  const [activeVehicleId, setActiveVehicleId] = useState<string>(DEFAULT_USER_VEHICLES[0].id);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(DEFAULT_MAINTENANCE_SCHEDULE);
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>(INITIAL_SERVICE_HISTORY);
  const [useImperial, setUseImperial] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const storedVehicles = localStorage.getItem('opel_intel_user_vehicles');
      if (storedVehicles) {
        setUserVehicles(JSON.parse(storedVehicles));
      }
      const storedActiveId = localStorage.getItem('opel_intel_active_vehicle_id');
      if (storedActiveId) {
        setActiveVehicleId(storedActiveId);
      }
      const storedImperial = localStorage.getItem('opel_intel_use_imperial');
      if (storedImperial !== null) {
        setUseImperial(JSON.parse(storedImperial));
      }
      const storedServices = localStorage.getItem('opel_intel_service_history');
      if (storedServices) {
        setServiceHistory(JSON.parse(storedServices));
      }
    } catch {
      // Fallback silently if localStorage isn't available
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem('opel_intel_user_vehicles', JSON.stringify(userVehicles));
      localStorage.setItem('opel_intel_active_vehicle_id', activeVehicleId);
      localStorage.setItem('opel_intel_use_imperial', JSON.stringify(useImperial));
      localStorage.setItem('opel_intel_service_history', JSON.stringify(serviceHistory));
    } catch {
      // storage quota or private browsing
    }
  }, [userVehicles, activeVehicleId, useImperial, serviceHistory, isClient]);

  const activeVehicle = userVehicles.find((v) => v.id === activeVehicleId) || userVehicles[0] || DEFAULT_USER_VEHICLES[0];
  const activeSpec = vehicles.find((s) => s.id === activeVehicle.specId) || vehicles[0];

  const updateActiveVehicle = (updater: (prev: UserVehicle) => UserVehicle) => {
    setUserVehicles((prev) =>
      prev.map((v) => (v.id === activeVehicle.id ? updater(v) : v))
    );
  };

  const toggleLock = () => {
    updateActiveVehicle((v) => ({
      ...v,
      isLocked: !v.isLocked,
      lastSyncTimestamp: new Date().toISOString(),
    }));
  };

  const toggleClimate = () => {
    updateActiveVehicle((v) => ({
      ...v,
      climatePreconditioningActive: !v.climatePreconditioningActive,
      lastSyncTimestamp: new Date().toISOString(),
    }));
  };

  const setTargetTemp = (temp: number) => {
    updateActiveVehicle((v) => ({
      ...v,
      targetCabinTempC: temp,
    }));
  };

  const toggleCharging = () => {
    updateActiveVehicle((v) => ({
      ...v,
      isCharging: !v.isCharging,
      chargingRateKw: !v.isCharging ? 11.0 : 0,
      lastSyncTimestamp: new Date().toISOString(),
    }));
  };

  const setSoc = (soc: number) => {
    updateActiveVehicle((v) => ({
      ...v,
      currentSocPercent: Math.min(100, Math.max(0, soc)),
      lastSyncTimestamp: new Date().toISOString(),
    }));
  };

  const refreshTelemetry = () => {
    updateActiveVehicle((v) => ({
      ...v,
      lastSyncTimestamp: new Date().toISOString(),
    }));
  };

  const addUserVehicle = (newVeh: Omit<UserVehicle, 'id' | 'lastSyncTimestamp'>) => {
    const id = `uv-${Date.now()}`;
    const vehicle: UserVehicle = {
      ...newVeh,
      id,
      lastSyncTimestamp: new Date().toISOString(),
    };
    setUserVehicles((prev) => [...prev, vehicle]);
    setActiveVehicleId(id);
  };

  const deleteUserVehicle = (id: string) => {
    if (userVehicles.length <= 1) return; // Keep at least one vehicle
    setUserVehicles((prev) => prev.filter((v) => v.id !== id));
    if (activeVehicleId === id) {
      const remaining = userVehicles.filter((v) => v.id !== id);
      setActiveVehicleId(remaining[0].id);
    }
  };

  const logServiceRecord = (record: Omit<ServiceRecord, 'id'>) => {
    const newRecord: ServiceRecord = {
      ...record,
      id: `sr-${Date.now()}`,
    };
    setServiceHistory((prev) => [newRecord, ...prev]);
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        userVehicles,
        activeVehicle,
        activeSpec,
        maintenanceItems,
        serviceHistory,
        useImperial,
        setUseImperial,
        setActiveVehicleId,
        addUserVehicle,
        deleteUserVehicle,
        toggleLock,
        toggleClimate,
        setTargetTemp,
        toggleCharging,
        setSoc,
        logServiceRecord,
        refreshTelemetry,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
