import type { Metadata } from 'next';
import './globals.css';
import { VehicleProvider } from '@/context/VehicleContext';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'OPEL INTELLIGENCE • European Automotive AI & Telematics Concept',
  description: 'An independent, high-performance automotive AI companion, smart maintenance tracker, and EV physics simulator designed for Opel electrified vehicles.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-opel-black text-opel-light flex flex-col font-sans antialiased selection:bg-opel-lime selection:text-black">
        <VehicleProvider>
          <Header />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </VehicleProvider>
      </body>
    </html>
  );
}
