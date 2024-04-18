import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server'; // Importar ReactDOMServer
import { Schedule } from './Schedule';
import { ScheduleHour } from './ScheduleHour';
import PDFComponent from '../templates/PDFComponent';

interface ScheduleDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
  scheduleHours: ScheduleHour[];
}

const ScheduleDetails = ({ isOpen, onClose, schedule, scheduleHours }: ScheduleDetailsProps) => {
  const formatTime = (timeArray: number[]): string => {
    const [hour, minute] = timeArray;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };


  const generatePDF = (): string => {
    const pdf = (
      <PDFComponent
        schedule={schedule}
        allHours={allHours}
        hourWeekdayHours={hourWeekdayHours}
        formatTime={formatTime}
      />
    );
    return ReactDOMServer.renderToString(pdf); // Renderizar el componente a una cadena de texto
  };

  const downloadPDF = () => {
    const pdfString = generatePDF(); // Obtener la cadena de texto del PDF
    const blob = new Blob([pdfString], { type: 'application/pdf' }); // Convertir la cadena de texto a Blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schedule.course}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter scheduleHours for only registered hours
  const registeredHours = scheduleHours.filter(hour => hour.start_time && hour.end_time);

  // Organize scheduleHours by n_hour and then by weekday
  const hourWeekdayHours: { [key: number]: ScheduleHour[] } = {};

  registeredHours.forEach(hour => {
    if (!hourWeekdayHours[hour.n_hour]) {
      hourWeekdayHours[hour.n_hour] = [];
    }
    // Push the hour object into the array corresponding to its n_hour
    hourWeekdayHours[hour.n_hour].push(hour);
  });

  // Get the highest registered hour
  const maxHour = Math.max(...registeredHours.map(hour => hour.n_hour));

  // Generate a list of all hours up to the highest registered hour
  const allHours = Array.from({ length: maxHour + 1 }, (_, i) => i);

  // Add or remove the 'no-scroll' class to the body when isOpen changes
  useEffect(() => {
    document.body.classList.toggle('no-scroll', isOpen);
  }, [isOpen]);

  return (
    isOpen ? (
      <div className="modal flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-content rounded-lg w-full mx-auto lg:w-1/2 drop-shadow-2xl bg-white p-8" style={{ position: 'relative' }}>
          <h2 className="backdrop-blur-md text-4xl pb-8 text-center text-blue-600">{`Horario de ${schedule.course}`}</h2>
          <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
            <table className="table-fixed w-full text-center border-collapse">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="border border-blue-500 px-4 py-2">Hora</th>
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(day => (
                    <th key={day} className="border border-blue-500 px-4 py-2">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allHours.map(n_hour => (
                  <tr key={n_hour}>
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day, index) => {
                      const hour = hourWeekdayHours[n_hour] && hourWeekdayHours[n_hour][index];
                      return (
                        <React.Fragment key={index}>
                          {index === 0 && (
                            <td className="border border-blue-500 px-4 py-2">
                              {hour ? `${formatTime(hour.start_time)} - ${formatTime(hour.end_time)}` : ' '}
                            </td>
                          )}
                          <td className="border border-blue-500 px-4 py-2">
                            {hour ? `${hour.subject_name} (${hour.classroom_name})` : ' '}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={downloadPDF} className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">Descargar PDF</button>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">Cerrar</button>
        </div>
      </div>


    ) : null
  );
};

export default ScheduleDetails;
