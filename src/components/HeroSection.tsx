import React from 'react';
import { Calendar, ChevronDown, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const scrollToFirstSection = () => {
    const firstSection = document.getElementById('details-section');
    if (firstSection) {
      firstSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

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

      {/* Decorative hearts */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.4
            }}
            initial={{ 
              scale: 0.5 + Math.random(), 
              rotate: Math.random() * 45 - 22.5 
            }}
            animate={{
              y: [-20, -60, -20],
              x: [0, Math.random() * 40 - 20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut"
            }}
          >
            <Heart 
              className="w-8 h-8 text-white fill-white" 
              strokeWidth={1} 
            />
          </motion.div>
        ))}
      </div>

      {/* Contenido */}
      <div className="relative h-full flex items-center justify-center z-10">
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

      {/* Botón de scroll */}
      <motion.button
        onClick={scrollToFirstSection}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center text-white cursor-pointer z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { delay: 1, duration: 0.8 }
        }}
        whileHover={{ scale: 1.1 }}
        aria-label="Desplazar hacia abajo"
      >
        {/* <span className="text-sm font-light mb-2 opacity-80">Descubrir</span> */}
        <motion.div
          animate={{ 
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="rounded-full bg-white/20 backdrop-blur-sm p-3 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
} 