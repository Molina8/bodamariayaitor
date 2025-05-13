import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface Departure {
  location: string;
  time: string;
}

interface Schedule {
  type: "ida" | "vuelta";
  departures?: Departure[];
  times?: string[];
}

const BusSchedule = () => {
  const schedules: Schedule[] = [
    {
      type: "ida",
      departures: [
        { location: "Plaza Circular", time: "18:15" },
        { location: "Hotel Nelva", time: "18:30" }
      ],
    },
    {
      type: "vuelta",
      departures: [
        { location: "Finca Siempre Verde", time: "02:30" },
        { location: "Finca Siempre Verde", time: "05:00" }
      ],
    }
  ];

  return (
    <section className="py-20 px-4 bg-rose-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif mb-4">Servicio de Transporte</h2>
          <p className="text-gray-600 mb-2">
            Hemos organizado un servicio de autobús para facilitar el transporte de nuestros invitados
          </p>
          <p className="text-amber-700 text-sm font-medium bg-amber-50 py-2 px-4 rounded-md inline-block border border-amber-200">
            ⚠️ Los horarios son provisionales y se confirmarán próximamente
          </p>
        </div>

        <div className="grid gap-8">
          {schedules.map((schedule, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
                schedule.type === "ida" ? "border-emerald-500" : "border-rose-500"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <span className={`text-xs uppercase font-bold px-2 py-1 rounded ${
                    schedule.type === "ida" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}>
                    {schedule.type === "ida" ? "Ida" : "Vuelta"}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Horarios de salida:</h4>
                <div className="space-y-3">
                  {schedule.departures?.map((departure, dIndex) => (
                    <div 
                      key={dIndex} 
                      className={`flex items-center p-3 rounded-md ${
                        schedule.type === "ida" ? "bg-emerald-50" : "bg-rose-50"
                      }`}
                    >
                      <MapPin className={`w-5 h-5 mr-2 ${
                        schedule.type === "ida" ? "text-emerald-600" : "text-rose-600"
                      }`} />
                      <span className={`font-medium ${
                        schedule.type === "ida" ? "text-emerald-800" : "text-rose-800"
                      }`}>
                        {departure.location}:
                      </span>
                      <div className="flex items-center ml-auto">
                        <Clock className={`w-4 h-4 mr-1 ${
                          schedule.type === "ida" ? "text-emerald-600" : "text-rose-600"
                        }`} />
                        <span className="font-semibold">{departure.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {schedule.type === "vuelta" && (
                  <div className="mt-4 bg-rose-100 p-3 rounded-md">
                    <p className="text-rose-800 text-sm italic">
                      * El fin de la fiesta está previsto para las 5:00am
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusSchedule;