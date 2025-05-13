import { useEffect, useRef } from 'react';

// Definimos interfaces básicas para Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
      }
    };
  }
}

// Coordenadas de la ubicación
const center = { lat: 38.037670, lng: -1.130777 };

// Estilo para el contenedor del mapa
const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
};

export function LocationMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Asegurarnos de que el elemento del mapa existe
    if (!mapRef.current) return;
    
    // Cargar la API de Google Maps de forma dinámica
    const loadGoogleMaps = () => {
      // Comprobar si Google Maps ya está cargado
      if (window.google && window.google.maps) {
        initMap();
        return;
      }
      
      // Si no está cargado, crear script y cargar
      const googleMapScript = document.createElement('script');
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      googleMapScript.async = true;
      googleMapScript.defer = true;
      window.document.body.appendChild(googleMapScript);
      
      googleMapScript.addEventListener('load', initMap);
    };
    
    // Inicializar el mapa una vez cargada la API
    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current!, {
        center,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      });
      
      // Añadir marcador
      new window.google.maps.Marker({
        position: center,
        map,
        title: 'Cmo. Don Luis, 12, 30110 Murcia'
      });
    };
    
    loadGoogleMaps();
    
    // Limpiar script cuando se desmonte el componente
    return () => {
      const googleMapScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (googleMapScript) {
        googleMapScript.removeEventListener('load', initMap);
      }
    };
  }, []);
  
  return <div ref={mapRef} style={containerStyle} />;
} 