import { MapPin, Navigation } from 'lucide-react';
import { LocationMap } from './LocationMap';

export function LocationSection() {
  const handleOpenMap = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=38.037670,-1.130777', '_blank');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ubicación</h2>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <MapPin className="w-5 h-5" />
            <p>Cmo. Don Luis, 12, 30110 Murcia</p>
          </div>
          <button
            onClick={handleOpenMap}
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition"
          >
            <Navigation className="w-4 h-4" />
            <span>Abrir en Google Maps</span>
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <LocationMap />
        </div>
      </div>
    </section>
  );
} 