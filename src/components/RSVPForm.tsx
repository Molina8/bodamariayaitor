import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { Users, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RSVPFormProps {
  onSubmit: () => void;
}

interface Companion {
  name: string;
  dietaryRestrictions: string;
  favoriteMusic: string;
}

type BusRoute = 'ayuntamiento' | 'hotel-nelva' | '';

interface FormData {
  name: string;
  email: string;
  phone: string;
  dietaryRestrictions: string;
  favoriteMusic: string;
  busService: boolean;
  busRoute: BusRoute;
  companions: Companion[];
}

const RSVPForm: React.FC<RSVPFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    dietaryRestrictions: '',
    favoriteMusic: '',
    busService: false,
    busRoute: '',
    companions: []
  });

  const handleAddCompanion = () => {
    setFormData(prev => ({
      ...prev,
      companions: [...prev.companions, { name: '', dietaryRestrictions: '', favoriteMusic: '' }]
    }));
  };

  const handleRemoveCompanion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.filter((_, i) => i !== index)
    }));
  };

  const handleCompanionChange = (index: number, field: keyof Companion, value: string) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.map((companion, i) => 
        i === index ? { ...companion, [field]: value } : companion
      )
    }));
  };

  // const formatCompanions = (companions: Companion[]): string => {
  //   if (companions.length === 0) return 'Sin acompañantes';
    
  //   return companions.map((companion, index) => `
  //     Acompañante ${index + 1}:
  //     - Nombre: ${companion.name}
  //     - Restricciones alimentarias: ${companion.dietaryRestrictions || 'Ninguna'}
  //     - Canción favorita: ${companion.favoriteMusic || 'Ninguna'}
  //   `).join('\n');
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Guardar en Supabase
      const {  error: supabaseError } = await supabase
        .from('guests')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            dietary_restrictions: formData.dietaryRestrictions || null,
            favorite_music: formData.favoriteMusic || null,
            bus_service: formData.busService,
            bus_route: formData.busRoute || null,
            companions: formData.companions.map(companion => ({
              name: companion.name,
              dietary_restrictions: companion.dietaryRestrictions || null,
              favorite_music: companion.favoriteMusic || null
            }))
          }
        ])
        .select();

      if (supabaseError) {
        console.error('Error de Supabase:', {
          message: supabaseError.message,
          details: supabaseError.details,
          hint: supabaseError.hint
        });
        throw new Error(`Error al guardar en la base de datos: ${supabaseError.message}`);
      }

      // // Email para el organizador
      // const organizerTemplateParams = {
      //   to_email: import.meta.env.VITE_ORGANIZER_EMAIL,
      //   from_name: formData.name,
      //   from_email: formData.email,
      //   phone: formData.phone,
      //   dietary_restrictions: formData.dietaryRestrictions || 'Ninguna',
      //   favorite_music: formData.favoriteMusic || 'Ninguna',
      //   bus_service: formData.busService ? `Sí - Parada: ${formData.busRoute}` : 'No',
      //   companions: formatCompanions(formData.companions),
      //   total_guests: formData.companions.length + 1
      // };

      // Crear enlace de Google Maps
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Cmo. Don Luis, 12, 30110 Murcia')}`;

      // Email de confirmación para el invitado
      const guestTemplateParams = {
        to_name: formData.name,
        to_email: formData.email,
        from_name: "María y Aitor",
        guest_name: formData.name,
        event_date: '21 de Junio de 2025',
        event_time: '19:00',
        event_location: 'Jardín Siempre Verde, Cmo. Don Luis, 12, 30110 Murcia',
        maps_url: mapsUrl,
        companions: formData.companions.length > 0 
          ? `y ${formData.companions.length} acompañante${formData.companions.length > 1 ? 's' : ''}`
          : '',
        domain: window.location.hostname,
        bus_details: formData.busService && formData.busRoute 
          ? `Recuerda que has solicitado servicio de autobús desde la parada: ${formData.busRoute === 'ayuntamiento' ? 'Ayuntamiento' : 'Hotel Nelva'}`
          : ''
      };

      // try {
      //   // Enviar email al organizador
      //   await emailjs.send(
      //     import.meta.env.VITE_EMAILJS_SERVICE_ID,
      //     import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      //     organizerTemplateParams,
      //     import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      //   );
        
      //   console.log('Email al organizador enviado correctamente');
      // } catch (emailError) {
      //   console.error('Error al enviar email al organizador:', emailError);
      //   throw new Error('Error al enviar email al organizador');
      // }

      try {
        // Enviar email de confirmación al invitado
        const result = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID,
          guestTemplateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        
        console.log('Email de confirmación enviado correctamente', result);
      } catch (emailError) {
        console.error('Error al enviar email de confirmación:', emailError);
        console.error('Detalles del error:', emailError);
        throw new Error('Error al enviar email de confirmación');
      }
      
      toast.success('¡Gracias por confirmar tu asistencia!');
      onSubmit();
    } catch (error) {
      console.log('Error detallado:', {
        message: error instanceof Error ? error.message : 'Error desconocido',
        error
      });
      toast.error('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 max-w-lg mx-auto relative">
      <div id="form-anchor" className="absolute -top-24"></div>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {/* Datos principales */}
        <div className="space-y-6" id="form-start">
          <h3 className="text-lg font-medium text-gray-900">Tus datos</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="dietary" className="block text-sm font-medium text-gray-700">
              Restricciones alimentarias
            </label>
            <textarea
              id="dietary"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              value={formData.dietaryRestrictions}
              onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="favoriteMusic" className="block text-sm font-medium text-gray-700">
              Canción que te gustaría escuchar
            </label>
            <input
              type="text"
              id="favoriteMusic"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              value={formData.favoriteMusic}
              onChange={(e) => setFormData({ ...formData, favoriteMusic: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="bus" className="text-sm font-medium text-gray-700">
                Servicio de autobús
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={formData.busService}
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  busService: !prev.busService,
                  busRoute: !prev.busService ? prev.busRoute : ''
                }))}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2
                  ${formData.busService ? 'bg-rose-500' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${formData.busService ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {formData.busService && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona una parada
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="ayuntamiento"
                      name="busRoute"
                      type="radio"
                      checked={formData.busRoute === 'ayuntamiento'}
                      onChange={() => setFormData({ ...formData, busRoute: 'ayuntamiento' })}
                      className="h-4 w-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                    />
                    <label htmlFor="ayuntamiento" className="ml-3 block text-sm font-medium text-gray-700">
                      Ayuntamiento
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="hotel-nelva"
                      name="busRoute"
                      type="radio"
                      checked={formData.busRoute === 'hotel-nelva'}
                      onChange={() => setFormData({ ...formData, busRoute: 'hotel-nelva' })}
                      className="h-4 w-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                    />
                    <label htmlFor="hotel-nelva" className="ml-3 block text-sm font-medium text-gray-700">
                      Hotel Nelva
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de acompañantes */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-medium text-gray-900">Acompañantes</h3>
            <button
              type="button"
              onClick={handleAddCompanion}
              className="inline-flex items-center px-3 py-1.5 border border-rose-500 text-rose-500 rounded-md hover:bg-rose-50 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus className="w-4 h-4 mr-1" />
              Añadir acompañante
            </button>
          </div>

          {formData.companions.map((companion, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-medium text-gray-700">Acompañante {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveCompanion(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    value={companion.name}
                    onChange={(e) => handleCompanionChange(index, 'name', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Restricciones alimentarias
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    value={companion.dietaryRestrictions}
                    onChange={(e) => handleCompanionChange(index, 'dietaryRestrictions', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Canción que le gustaría escuchar
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    value={companion.favoriteMusic}
                    onChange={(e) => handleCompanionChange(index, 'favoriteMusic', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Users className="w-5 h-5" />
              Confirmar asistencia
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RSVPForm;