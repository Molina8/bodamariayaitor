import{ useState, useEffect } from 'react';
import { MapPin, Clock, Mail, Phone, Shirt, CalendarPlus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import RSVPForm from './components/RSVPForm';
import BusSchedule from './components/BusSchedule';
import { LocationSection } from './components/LocationSection';
import { HeroSection } from './components/HeroSection';
import { ScrollToTop } from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminPanel } from './components/AdminPanel';

function App() {
  const [showRSVPForm, setShowRSVPForm] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);

  const eventDetails = {
    title: 'Boda María & Aitor',
    description: 'Celebración de la boda de María y Aitor en Jardín Siempre Verde',
    location: 'Cmo. Don Luis, 12, 30110 Murcia',
    startDate: '2025-06-21T19:00:00',
    endDate: '2025-06-22T00:00:00',
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generateCalendarLinks = () => {
    // Google Calendar
    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.append('action', 'TEMPLATE');
    googleUrl.searchParams.append('text', eventDetails.title);
    googleUrl.searchParams.append('details', eventDetails.description);
    googleUrl.searchParams.append('location', eventDetails.location);
    googleUrl.searchParams.append('dates', `${eventDetails.startDate.replace(/[-:]/g, '')}/${eventDetails.endDate.replace(/[-:]/g, '')}`);

    // iCal/Outlook
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${eventDetails.startDate.replace(/[-:]/g, '')}
DTEND:${eventDetails.endDate.replace(/[-:]/g, '')}
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;

    const icsFile = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const icsUrl = URL.createObjectURL(icsFile);

    return { googleUrl: googleUrl.toString(), icsUrl };
  };

  const handleAddToCalendar = (type: 'google' | 'ical') => {
    const { googleUrl, icsUrl } = generateCalendarLinks();
    
    if (type === 'google') {
      window.open(googleUrl, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = icsUrl;
      link.download = 'boda-maria-aitor.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(icsUrl);
    }
  };

  const handleShowForm = () => {
    setShowRSVPForm(true);
    // Esperamos un tick para que el formulario se renderice
    setTimeout(() => {
      const formElement = document.getElementById('rsvp-form');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Toaster position="top-center" />
        
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={
            <>
              <HeroSection />
              {/* Wedding Details */}
              <section className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-serif mb-12">Detalles de la Ceremonia</h2>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center">
                      <Clock className="w-10 h-10 text-rose-500 mb-4" />
                      <h3 className="text-xl mb-2">Hora</h3>
                      <p>19:00 hrs</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <MapPin className="w-10 h-10 text-rose-500 mb-4" />
                      <h3 className="text-xl mb-2">Lugar</h3>
                      <p>Finca Siempre Verde</p>
                      <p>Cmo. Don Luis, 12</p>
                      <p>30110 Murcia</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <Shirt className="w-10 h-10 text-rose-500 mb-4" />
                      <h3 className="text-xl mb-2">Código de Vestimenta</h3>
                      <p>Formal</p>
                    </div>
                  </div>
                </div>
              </section>
              <BusSchedule />
              {/* RSVP Section */}
              <section className="py-20 px-4 bg-rose-50">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-serif mb-8">Confirmación de Asistencia</h2>
                  
                  {!hasResponded && !showRSVPForm ? (
                    <div className="space-y-6">
                      <p className="text-lg mb-8">¿Nos acompañarás en este día tan especial?</p>
                      <div className="flex flex-col items-center gap-6">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={handleShowForm}
                            className="bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 transition"
                          >
                            Sí, asistiré
                          </button>
                          <button
                            onClick={() => setHasResponded(true)}
                            className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition"
                          >
                            No podré asistir
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : hasResponded ? (
                    <p className="text-xl">¡Gracias por tu respuesta!</p>
                  ) : null}

                  {showRSVPForm && !hasResponded && (
                    <div id="rsvp-form">
                      <RSVPForm onSubmit={() => setHasResponded(true)} />
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <button
                      onClick={() => handleAddToCalendar('google')}
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-rose-600 bg-white border-2 border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm"
                    >
                      <CalendarPlus className="w-5 h-5" />
                      Agregar fecha al calendario
                    </button>
                  </div>
                </div>
              </section>
              <main className="flex-grow">
                {/* ... contenido principal ... */}
              </main>
              <LocationSection />
              
              <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-2xl font-serif mb-8">¿Tienes preguntas?</h2>
                  <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
                    <a 
                      href="mailto:mariamolinapiernas@gmail.com" 
                      className="flex items-center gap-2 hover:text-rose-400 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      mariamolinapiernas@gmail.com
                    </a>
                    <a 
                      href="tel:+34679847372" 
                      className="flex items-center gap-2 hover:text-rose-400 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      679 847 372
                    </a>
                  </div>
                </div>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;