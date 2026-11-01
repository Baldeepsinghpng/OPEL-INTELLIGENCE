import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKm(km: number, useImperial = false): string {
  if (useImperial) {
    const miles = Math.round(km * 0.621371);
    return `${miles.toLocaleString()} mi`;
  }
  return `${Math.round(km).toLocaleString()} km`;
}

export function formatSpeed(kmh: number, useImperial = false): string {
  if (useImperial) {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${kmh} km/h`;
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTemp(celsius: number, useImperial = false): string {
  if (useImperial) {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatPressure(bar: number, useImperial = false): string {
  if (useImperial) {
    const psi = (bar * 14.5038).toFixed(1);
    return `${psi} psi`;
  }
  return `${bar.toFixed(1)} bar`;
}
