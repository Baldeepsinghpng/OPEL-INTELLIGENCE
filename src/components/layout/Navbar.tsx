'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bot, 
  Wrench, 
  BatteryCharging, 
  Compass, 
  Warehouse,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'AI Assistant',
    href: '/assistant',
    icon: Bot,
    badge: 'AI',
  },
  {
    name: 'Smart Maintenance',
    href: '/maintenance',
    icon: Wrench,
    badge: '1 Due',
  },
  {
    name: 'EV Companion',
    href: '/ev-companion',
    icon: BatteryCharging,
    badge: null,
  },
  {
    name: 'Vehicle Explorer',
    href: '/explorer',
    icon: Compass,
    badge: null,
  },
  {
    name: 'My Garage',
    href: '/garage',
    icon: Warehouse,
    badge: null,
  },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-opel-border bg-opel-black/60 backdrop-blur-md sticky top-[89px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 group ${
                  isActive
                    ? 'text-white bg-opel-graphite border border-opel-border-bright shadow-sm'
                    : 'text-opel-silver hover:text-white hover:bg-opel-graphite/40'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-opel-lime' : 'text-opel-silver group-hover:text-white'
                  }`}
                />
                <span>{item.name}</span>

                {item.badge && (
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                      item.badge === 'AI'
                        ? 'bg-opel-lime/20 text-opel-lime border border-opel-lime/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active Indicator Underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-opel-lime rounded-full shadow-lime-glow-sm" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
