import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Guest } from '../types/database';
import { Download, RefreshCw, Music, User, Phone, Bus, AlignJustify, Users, Mail, Utensils, Home, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPanel() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalGuests, setTotalGuests] = useState(0);
  const [expandedGuest, setExpandedGuest] = useState<number | null>(null);
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setIsAuthLoading(false);
        if (session) {
          fetchGuests();
        } else {
          setIsLoading(false);
        }
      }
    );

    // Obtener la sesión actual al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
      if (session) {
        fetchGuests();
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchGuests() {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data || []);
      
      // Calcular total de invitados incluyendo acompañantes
      const total = (data || []).reduce((acc, guest) => 
        acc + 1 + (guest.companions?.length || 0), 0
      );
      setTotalGuests(total);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }

  const handleExportToCSV = () => {
    const headers = ['Nombre', 'Email', 'Teléfono', 'Autobús', 'Parada', 'Restricciones', 'Canción', 'Acompañantes'];
    const csvData = guests.map(guest => [
      guest.name,
      guest.email,
      guest.phone,
      guest.bus_service ? 'Sí' : 'No',
      guest.bus_route || '-',
      guest.dietary_restrictions || '-',
      guest.favorite_music || '-',
      guest.companions.map(c => c.name).join(', ') || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invitados.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleGuestDetails = (guestId: number) => {
    setExpandedGuest(expandedGuest === guestId ? null : guestId);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      setSession(data.session);
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);
      setLoginError(error.message || 'Error al iniciar sesión. Comprueba tus credenciales.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Panel de Administración</h2>
            <p className="mt-2 text-sm text-gray-600">Inicia sesión para acceder</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{loginError}</div>
              </div>
            )}
            
            <div className="rounded-md -space-y-px">
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isAuthLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
              >
                {isAuthLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-rose-600 hover:text-rose-500">
              Volver a la página principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">
            Total de invitados confirmados: {totalGuests}
          </p>
          {session && (
            <p className="text-gray-500 text-sm mt-1">
              Conectado como: {session.user.email}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link 
            to="/"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Home className="h-4 w-4 mr-2" />
            Volver a la web
          </Link>
          <button
            onClick={fetchGuests}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button
            onClick={handleExportToCSV}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
          </div>
        )}
        
        {/* Vista de escritorio - tabla completa */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autobús
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restricciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Canción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acompañantes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{guest.email}</div>
                    <div className="text-sm text-gray-500">{guest.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {guest.bus_service ? (
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Sí
                        </span>
                        <div className="text-sm text-gray-500 mt-1">{guest.bus_route}</div>
                      </div>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {guest.dietary_restrictions || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {guest.favorite_music || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {guest.companions.length > 0 ? (
                      <ul className="text-sm text-gray-900">
                        {guest.companions.map((companion, index) => (
                          <li key={index} className="mb-1">
                            {companion.name}
                            {companion.dietary_restrictions && (
                              <span className="text-sm text-gray-500 ml-2">
                                ({companion.dietary_restrictions})
                              </span>
                            )}
                            {companion.favorite_music && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Music className="h-3 w-3 text-gray-400 mr-1" />
                                {companion.favorite_music}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-gray-500">Sin acompañantes</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Vista móvil - tarjetas */}
        <div className="md:hidden">
          <ul className="divide-y divide-gray-200">
            {guests.map((guest) => (
              <li key={guest.id} className="px-4 py-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleGuestDetails(guest.id)}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                  </div>
                  <div className={`transform transition-transform ${expandedGuest === guest.id ? 'rotate-180' : ''}`}>
                    <AlignJustify className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                {expandedGuest === guest.id && (
                  <div className="mt-4 space-y-3 pl-8">
                    <div className="flex">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-500">{guest.phone}</div>
                    </div>
                    
                    <div className="flex">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-500">{guest.email}</div>
                    </div>
                    
                    <div className="flex items-center">
                      <Bus className="h-4 w-4 text-gray-400 mr-2" />
                      {guest.bus_service ? (
                        <div className="flex items-center">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-2">
                            Sí
                          </span>
                          <span className="text-sm text-gray-500">{guest.bus_route}</span>
                        </div>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-start">
                      <Utensils className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Restricciones:</div>
                        <div className="text-sm text-gray-500">
                          {guest.dietary_restrictions || 'Ninguna'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Music className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Canción:</div>
                        <div className="text-sm text-gray-500">
                          {guest.favorite_music || 'No especificada'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Acompañantes:</div>
                        {guest.companions.length > 0 ? (
                          <ul className="text-sm text-gray-500">
                            {guest.companions.map((companion, index) => (
                              <li key={index} className="mt-1">
                                {companion.name}
                                {companion.dietary_restrictions && (
                                  <span className="text-sm text-gray-500 ml-2 block">
                                    ({companion.dietary_restrictions})
                                  </span>
                                )}
                                {companion.favorite_music && (
                                  <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <Music className="h-3 w-3 text-gray-400 mr-1" />
                                    {companion.favorite_music}
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-sm text-gray-500">Sin acompañantes</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 