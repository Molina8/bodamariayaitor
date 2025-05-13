import React from 'react';
import { Calendar } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Imagen de fondo para dispositivos móviles */}
      <div 
        className="absolute inset-0 bg-cover bg-center transform scale-105 block md:hidden"
        style={{
          backgroundImage: 'url("/anillo.jpeg")',
          backgroundPosition: 'center',
          willChange: 'transform',
        }}
      />
      
      {/* Imagen de fondo para tablets y escritorio */}
      <div 
        className="absolute inset-0 bg-cover bg-center transform scale-105 hidden md:block"
        style={{
          backgroundImage: 'url("/anillo.jpeg")',
          backgroundPosition: 'center',
          willChange: 'transform',
        }}
      />

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/75" />

      {/* Contenido */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-4xl md:text-7xl font-serif mb-4 tracking-wide">
            María & Aitor
          </h1>
          <p className="text-lg md:text-2xl mb-6 md:mb-8">
            ¡Nos casamos!
          </p>
          <div className="flex items-center justify-center gap-2 text-base md:text-xl">
            <Calendar className="w-5 h-5 md:w-6 md:h-6" />
            <span>21 de Junio, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
} 