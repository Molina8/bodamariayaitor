import { useState, useEffect } from 'react';
import { MapPin, Clock, Mail, Phone, Shirt, CalendarPlus, User, Heart } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import RSVPForm from './components/RSVPForm';
import BusSchedule from './components/BusSchedule';
import { LocationSection } from './components/LocationSection';
import { HeroSection } from './components/HeroSection';
import { ScrollToTop } from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
    // Esperamos un poco más para que el formulario se renderice completamente
    setTimeout(() => {
      const formAnchor = document.getElementById('form-anchor');
      if (formAnchor) {
        formAnchor.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 450); // Aumentamos el tiempo para asegurarnos de que todo está renderizado
  };

  // Variantes para animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50 to-white overflow-hidden relative">
        {/* Elementos decorativos de jardín */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-rose-300 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-200 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-amber-200 rounded-full blur-3xl"></div>
          <div className="absolute top-2/3 left-1/4 w-48 h-48 bg-purple-200 rounded-full blur-3xl"></div>
          
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-40 bg-gradient-to-b from-rose-300 to-transparent opacity-40"
              style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          ))}
        </div>
        
        <ScrollToTop />
        <Toaster position="top-center" />
        
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={
            <>
              <HeroSection />
              
              {/* Wedding Details */}
              <section id="details-section" className="py-24 px-4 relative z-10">
                <motion.div 
                  className="max-w-4xl mx-auto text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                >
                  <h2 className="text-4xl font-serif mb-16 text-rose-800 relative inline-block">
                    Detalles de la Ceremonia
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent bottom-0 left-0"></div>
                  </h2>
                  
                  <motion.div 
                    className="grid md:grid-cols-3 gap-12"
                    variants={staggerContainer}
                  >
                    <motion.div 
                      className="flex flex-col items-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_10px_30px_-15px_rgba(244,63,94,0.3)] border border-rose-100 hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.45)] transition-all duration-300"
                      variants={fadeInUp}
                    >
                      <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6 shadow-[0_8px_16px_-6px_rgba(244,63,94,0.3)]">
                        <Clock className="w-8 h-8 text-rose-600" />
                      </div>
                      <h3 className="text-2xl font-medium mb-3 text-rose-800">Hora</h3>
                      <p className="text-slate-700">19:00 hrs</p>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col items-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_10px_30px_-15px_rgba(251,191,36,0.3)] border border-rose-100 hover:shadow-[0_20px_40px_-15px_rgba(251,191,36,0.45)] transition-all duration-300"
                      variants={fadeInUp}
                    >
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-[0_8px_16px_-6px_rgba(251,191,36,0.3)]">
                        <MapPin className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-medium mb-3 text-rose-800">Lugar</h3>
                      <p className="text-slate-700">Finca Siempre Verde</p>
                      <p className="text-slate-700">Cmo. Don Luis, 12</p>
                      <p className="text-slate-700">30110 Murcia</p>
                    </motion.div>
                    
                    <motion.div 
                      className="flex flex-col items-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_10px_30px_-15px_rgba(168,85,247,0.3)] border border-rose-100 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.45)] transition-all duration-300"
                      variants={fadeInUp}
                    >
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6 shadow-[0_8px_16px_-6px_rgba(168,85,247,0.3)]">
                        <Shirt className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-medium mb-3 text-rose-800">Código de Vestimenta</h3>
                      <p className="text-slate-700">Formal</p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </section>
              
              <BusSchedule />
              
              {/* RSVP Section */}
              <motion.section 
                className="py-24 px-4 bg-gradient-to-br from-rose-50 to-lavender-50 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-8 h-8 text-rose-400"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`
                      }}
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeInOut"
                      }}
                    >
                      <Heart strokeWidth={1.5} />
                    </motion.div>
                  ))}
                </div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                  <motion.h2 
                    className="text-4xl font-serif mb-12 text-rose-800 relative inline-block"
                    variants={fadeInUp}
                  >
                    Confirmación de Asistencia
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent bottom-0 left-0"></div>
                  </motion.h2>
                  
                  <AnimatePresence mode="wait">
                    {!hasResponded && !showRSVPForm ? (
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key="buttons"
                      >
                        <p className="text-xl mb-10 text-slate-700">¿Nos acompañarás en este día tan especial?</p>
                        <div className="flex flex-col items-center gap-6">
                          <div className="flex flex-wrap justify-center gap-4">
                            <motion.button
                              onClick={handleShowForm}
                              className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-10 py-4 rounded-lg shadow-[0_10px_25px_-5px_rgba(244,63,94,0.5)] hover:shadow-[0_20px_35px_-5px_rgba(244,63,94,0.65)] transition-all duration-300 transform hover:-translate-y-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Sí, asistiré
                            </motion.button>
                            <motion.button
                              onClick={() => setHasResponded(true)}
                              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-10 py-4 rounded-lg shadow-[0_10px_25px_-5px_rgba(107,114,128,0.5)] hover:shadow-[0_20px_35px_-5px_rgba(107,114,128,0.65)] transition-all duration-300 transform hover:-translate-y-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              No podré asistir
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ) : hasResponded ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key="thankyou"
                      >
                        <p className="text-2xl text-rose-800 font-serif">¡Gracias por tu respuesta!</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {showRSVPForm && !hasResponded && (
                    <motion.div 
                      id="rsvp-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <RSVPForm onSubmit={() => setHasResponded(true)} />
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="mt-12"
                    variants={fadeInUp}
                  >
                    <motion.button
                      onClick={() => handleAddToCalendar('google')}
                      className="inline-flex items-center gap-3 px-8 py-3.5 text-rose-700 bg-white border-2 border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all shadow-[0_10px_20px_-8px_rgba(244,63,94,0.25)] hover:shadow-[0_14px_28px_-8px_rgba(244,63,94,0.4)]"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CalendarPlus className="w-5 h-5" />
                      Agregar fecha al calendario
                    </motion.button>
                  </motion.div>
                </div>
              </motion.section>
              
              <main className="flex-grow">
                {/* ... contenido principal ... */}
              </main>
              
              <LocationSection />
              
              <motion.footer 
                className="bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 py-12 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                {/* Elementos decorativos */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-32 h-32 border border-rose-400 rounded-full"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        transform: `scale(${0.5 + Math.random() * 1.5})`,
                      }}
                    ></div>
                  ))}
                </div>
                
                <div className="max-w-4xl mx-auto text-center z-10 relative">
                  <motion.h2 
                    className="text-3xl font-serif mb-10 text-rose-800"
                    variants={fadeInUp}
                  >
                    ¿Tienes preguntas?
                  </motion.h2>
                  
                  <motion.div 
                    className="flex flex-col md:flex-row justify-center gap-6 md:gap-12"
                    variants={staggerContainer}
                  >
                    <motion.a 
                      href="mailto:mariamolinapiernas@gmail.com" 
                      className="flex items-center gap-3 hover:text-rose-600 transition-colors group"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center group-hover:bg-white transition-colors shadow-[0_6px_12px_-3px_rgba(244,63,94,0.3)] group-hover:shadow-[0_8px_16px_-3px_rgba(244,63,94,0.4)]">
                        <Mail className="w-5 h-5 text-rose-600" />
                      </div>
                      mariamolinapiernas@gmail.com
                    </motion.a>
                    
                    <motion.a 
                      href="tel:+34679847372" 
                      className="flex items-center gap-3 hover:text-rose-600 transition-colors group"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center group-hover:bg-white transition-colors shadow-[0_6px_12px_-3px_rgba(244,63,94,0.3)] group-hover:shadow-[0_8px_16px_-3px_rgba(244,63,94,0.4)]">
                        <Phone className="w-5 h-5 text-rose-600" />
                      </div>
                      679 847 372
                    </motion.a>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-12"
                    variants={fadeInUp}
                  >
                    <Link 
                      to="/admin" 
                      className="inline-flex items-center gap-2 text-rose-600 hover:text-amber-500 transition-colors opacity-60 hover:opacity-100"
                      aria-label="Acceso administración"
                    >
                      <User className="w-5 h-5" />
                    </Link>
                  </motion.div>
                </div>
              </motion.footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;