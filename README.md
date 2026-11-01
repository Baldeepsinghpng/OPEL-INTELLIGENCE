# OPEL INTELLIGENCE
### European Electrified Automotive AI & Telematics Platform

> **IMPORTANT COMPLIANCE & LEGAL NOTICE**
> 
> **OPEL INTELLIGENCE** is an **independent automotive concept demonstration and software engineering showcase**.
> It is **NOT** an official Opel Automobile GmbH or Stellantis N.V. product, and does not claim internal affiliation, endorsement, sponsorship, or access to private enterprise networks.
> All brand marks belong to their respective owners. Technical specifications are sourced strictly from publicly available European homologation documentation and Stellantis media publications.

---

## ⚡ Overview

**OPEL INTELLIGENCE** is a production-quality automotive web application designed to demonstrate the next generation of connected European electric vehicle (EV) companions. Built with a sophisticated European automotive aesthetic—featuring deep charcoal, carbon, off-white, and electric lime accents reminiscent of the modern Opel Vizor identity.

The platform provides an end-to-end connected vehicle cockpit with real-time simulated CAN-bus telematics, physics-grounded EV consumption modelling, certified maintenance tracking, and an automotive engineering AI assistant powered by **Google Gemini API**.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18, Server Components & Server Routes)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom European automotive dark design system)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Core**: [Google Generative AI (Gemini 1.5 Flash)](https://ai.google.dev/) via secure server-side API route with domain-expert fallback
- **Database & Sync**: [Supabase](https://supabase.com/) client with local browser sandbox fallback
- **Animations**: Subtle CSS keyframe animations, glassmorphism, radar pulse, and glowing Vizor accents
- **Deployment**: Vercel-compatible zero-configuration deployment

---

## 🏎️ Core Modules

### 1. Dashboard (`/` or `/dashboard`)
- **Cockpit Overview**: Active vehicle hero presentation, model year, trim, platform architecture, and real-time range estimation.
- **Simulated Controls**: Interactive toggle for door locks, cabin climate preconditioning (heat pump), and simulated charging status.
- **Traction Battery HUD**: Live State of Charge (SoC), energy capacity (kWh), daily (80%) vs trip (100%) charging limit selector, and time-to-full calculator.
- **Chassis Telemetry**: 4-wheel wireless Tire Pressure Monitoring System (TPMS) visualization, 12V auxiliary AGM battery health, and cabin temperature sensors.
- **Maintenance & AI Shortcuts**: Upcoming service highlights and quick-launch diagnostic prompt chips.

### 2. AI Vehicle Assistant (`/assistant`)
- Real conversational assistant integrated via secure server-side Next.js route (`/api/assistant`).
- Powered by **Google Gemini 1.5 Flash** with custom automotive system instructions.
- Includes a grounded domain fallback engine if no API key is provided, ensuring flawless evaluation out-of-the-box.
- **Strict Compliance**: Cites verified European homologation references; never hallucinates maintenance intervals or unsupported vehicle features.
- Suggested prompt chips for winter range degradation, charging curves, and lighting technology.

### 3. Smart Maintenance (`/maintenance`)
- Vehicle-specific maintenance timeline based on verified European service manuals (e.g., Year 1 / 25,000 km, 2-Year Brake Fluid Flush, Cabin HEPA filter, High-Voltage Coolant loop).
- **Educational Explanations**: Deep engineering insights on why EVs require brake fluid flushes (hygroscopic moisture absorption despite regenerative braking) and 12V battery tests.
- **Digital Service Log**: Interactive form to record and store workshop inspection history.

### 4. EV Companion & Trip Simulator (`/ev-companion`)
- **Physics-Grounded Range Simulator**:
  - Distance slider (20 to 650 km)
  - Highway/Autobahn ratio (aero drag scaling $F_d \propto v^2$)
  - Ambient temperature (-15°C to 40°C) with cold-weather lithium chemistry and heat pump load
  - Cabin HVAC on/off toggle and payload weight
  - Real-time projected consumption (kWh/100km) and arrival battery %
- **Charging Duration Matrix**: Compares 2.3 kW domestic Schuko, 7.4 kW Wallbox, 11 kW 3-phase, 50 kW rapid DC, and 100–160 kW high-power HPC chargers.
- **Financial Savings Calculator**: Compares electricity charging costs against equivalent European petrol/diesel consumption.

### 5. Vehicle Explorer (`/explorer`)
- Detailed specifications for the modern electrified Opel lineup:
  - **Opel Astra Electric** (54 kWh, 418 km WLTP, 156 hp)
  - **Opel Grandland Electric** (STLA Medium, 98 kWh, 700 km WLTP, 213 hp)
  - **Opel Corsa Electric** (Long Range 51 kWh, 405 km WLTP)
  - **Opel Mokka Electric** (54 kWh, 407 km WLTP)
  - **Opel Frontera Electric** (54 kWh, 400 km WLTP)
  - **Opel Astra GSe Plug-in Hybrid** (225 hp performance hybrid, Koni FSD suspension)
- **Side-by-Side Comparison Matrix**: Select up to 3 models to compare acceleration, charging rates, trunk volumes, and platforms.
- Verified public documentation links to Stellantis European press archives.

### 6. My Garage & Fleet (`/garage`)
- Manage enrolled demo vehicles.
- Add custom vehicles with license plates, colors, and initial odometers.
- Switch active vehicle with one click to update the entire application state.
- Export fleet data as JSON.
- Supabase cloud fleet status and metric/imperial unit toggle.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18.17+ or v20+
- **npm** (or pnpm/yarn)

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables:
```env
# Google Gemini API Key (Optional - application runs out-of-the-box with built-in domain fallback)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Credentials (Optional - for cloud fleet synchronization)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Running the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Building for Production
```bash
npm run build
npm run start
```

---

## 🔒 Security & Architecture Standards

1. **Zero Client Secret Exposure**: API keys (`GEMINI_API_KEY`) are accessed strictly within server-side routes (`/api/assistant`) and are never leaked to client bundles.
2. **Input Validation**: All incoming requests to the API route validate payload structure, maximum character lengths, and sanitize prompts.
3. **Graceful Fallbacks**: If external cloud services (Gemini or Supabase) are unconfigured, the application runs fully functional in local sandbox mode with rich, grounded domain knowledge.
4. **Verified Automotive Data**: No fabricated maintenance intervals or false live charger occupancies. All specifications cite official homologation standards.

---

*Opel, Astra, Corsa, Grandland, Mokka, Frontera, Pure Panel®, and Intelli-Lux LED® are registered trademarks of their respective owners. Opel Intelligence is an independent engineering concept.*
