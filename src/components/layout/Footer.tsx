'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ExternalLink, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-opel-border bg-opel-carbon/80 mt-16 text-opel-silver text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Identity & Legal Statement */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white font-display text-sm">
                OPEL <span className="text-opel-lime font-black">INTELLIGENCE</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-opel-graphite border border-opel-border text-opel-silver">
                Independent Concept
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-opel-graphite/60 border border-opel-border text-xs leading-relaxed text-opel-silver">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>LEGAL & COMPLIANCE NOTICE</span>
              </div>
              <p>
                This web application is an <strong>independent concept demonstration and automotive engineering showcase</strong>. 
                It is <strong>NOT</strong> an official Opel Automobile GmbH, Stellantis N.V., or Vauxhall Motors product, nor does it imply endorsement, affiliation, sponsorship, or access to private enterprise servers.
              </p>
              <p className="mt-1.5 text-[11px] text-opel-silver/70">
                Opel, Astra, Corsa, Grandland, Mokka, Frontera, Pure Panel®, and Intelli-Lux LED® are registered trademarks of their respective owners. Technical specifications are referenced strictly from publicly released European homologation datasheets.
              </p>
            </div>
          </div>

          {/* Column 2: Public Data Sources */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-mono tracking-wider text-white font-semibold">
              Public Verified Sources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.media.stellantis.com/em-en/opel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-opel-lime transition-colors inline-flex items-center gap-1.5"
                >
                  Stellantis Media Opel Hub
                  <ExternalLink className="w-3 h-3 text-opel-silver/60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.opel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-opel-lime transition-colors inline-flex items-center gap-1.5"
                >
                  Opel Official Portal (Europe)
                  <ExternalLink className="w-3 h-3 text-opel-silver/60" />
                </a>
              </li>
              <li>
                <a
                  href="https://unece.org/transport/vehicle-regulations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-opel-lime transition-colors inline-flex items-center gap-1.5"
                >
                  UNECE WLTP Homologation
                  <ExternalLink className="w-3 h-3 text-opel-silver/60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Architecture */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-mono tracking-wider text-white font-semibold">
              Platform Architecture
            </h4>
            <ul className="space-y-1.5 text-xs text-opel-silver/80 font-mono">
              <li>• Next.js App Router (Vercel)</li>
              <li>• Google Gemini AI Integration</li>
              <li>• Supabase Cloud Fleet Layer</li>
              <li>• Tailwind CSS & Framer Motion</li>
              <li>• Real-Time Physics EV Simulator</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-opel-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-opel-silver/60">
          <div>
            © {new Date().getFullYear()} Opel Intelligence Project. Built for advanced European automotive exploration.
          </div>
          <div className="flex items-center gap-4">
            <span>Rüsselsheim Engineering Heritage</span>
            <span>•</span>
            <span>STLA Smart Telematics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
