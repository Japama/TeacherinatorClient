import React from 'react';
import { Schedule } from './Schedule';
import { ScheduleHour } from './ScheduleHour';

interface ScheduleDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
  scheduleHours: ScheduleHour[];
}

const ScheduleDetails = ({ isOpen, onClose, schedule, scheduleHours }: ScheduleDetailsProps) => {
  const getWeekdayName = (weekDay: number): string => {
    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    return weekdays[weekDay];
  };

  const formatTime = (timeArray: number[]): string => {
    const [hour, minute] = timeArray;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  // Filter scheduleHours for only registered hours
  const registeredHours = scheduleHours.filter(hour => hour.start_time && hour.end_time);

  // Organize scheduleHours by n_hour and then by weekday
  const hourWeekdayHours: { [key: number]: { [key: number]: ScheduleHour } } = {};

  registeredHours.forEach(hour => {
    if (!hourWeekdayHours[hour.n_hour]) {
      hourWeekdayHours[hour.n_hour] = {};
    }
    hourWeekdayHours[hour.n_hour][hour.week_day] = hour;
  });

  // Get the highest registered hour
  const maxHour = Math.max(...registeredHours.map(hour => hour.n_hour));

  // Generate a list of all hours up to the highest registered hour
  const allHours = Array.from({ length: maxHour + 1 }, (_, i) => i);

  return (
    isOpen ? (
      <div className="modal " style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className=" rounded-md modal-content w-full mx-auto lg:w-[800px] drop-shadow-lg bg-white p-12" style={{ position: 'relative', margin: '0 auto', top: '50%', transform: 'translateY(-50%)' }}>
          <h2 className="backdrop-blur-sm text-4xl pb-8">Horario de {schedule.course}</h2>
          <table className="table-fixed w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Hora</th>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(day => (
                  <th key={day} className="border px-4 py-2">{day}</th>
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
                        {index === 0 && <td className="border px-4 py-2">{hour ? `${formatTime(hour.start_time)} - ${formatTime(hour.end_time)}` : ' '}</td>}
                        <td className="border px-4 py-2">
                          {hour ? `${hour.subject_name} (${hour.classroom_name})` : ' '}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
            </tbody>

          </table>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Cerrar</button>
        </div>
      </div>
    ) : null
  );
};

export default ScheduleDetails;
