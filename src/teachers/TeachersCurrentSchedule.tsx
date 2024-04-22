import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ScheduleHour } from '../schedules/ScheduleHour';

function TeachersCurrentSchedule() {
  const navigate = useNavigate();
  const [currentScheduleHour, setCurrentScheduleHour] = useState<ScheduleHour | null>(null);
  const [nextScheduleHour, setNextScheduleHour] = useState<ScheduleHour | null>(null);

  const notify = (message: string) => {
    toast(message, { position: "top-center" })
  }

  const fetchData = async (method: string, params: object) => {
    try {
      const response = await fetch('http://127.0.0.1:8081/api/rpc', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "id": 1,
          "method": method,
          "params": params
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.result;
      } else {
        console.error(`Error al obtener los ${method}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const checkLogin = () => {
    const loggedInCookie = Cookies.get('loged_in');
    if (loggedInCookie !== "true") {
      navigate("/login");
    }
    return true;
  };

  const fetchDataWithFilters = async (endpoint: string, filters: Record<string, unknown>) => {
    try {
      const response = await fetchData(endpoint, { filters });
      if (response) {
        return response;
      }
      throw new Error(`No data found for ${endpoint}`);
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  const fetchAllData = async () => {
    const schedule = await fetchDataWithFilters("get_user_schedule", {});
    if (!schedule) return;
    const scheduleHours = await fetchDataWithFilters("list_schedule_hours", {});
    if (!scheduleHours) return;

    // Obtén la hora y el día de la semana actuales
    const specificDate = new Date('2024-04-22T02:50:00'); // Año-Mes-DíaTHora:Minuto:Segundo
    const probando = false;
    const currentTime = probando ? specificDate : new Date();
    const currentDayOfWeek = (currentTime.getDay() + 6) % 7; // Ajusta para que 0 sea lunes y 4 sea viernes

    const startHour: ScheduleHour = scheduleHours.find((hour: ScheduleHour) => {
      return hour.n_hour === 0;
    });

    // Filtra los horarios para encontrar el horario actual y el próximo
    const startTime = new Date(currentTime);
    const endTime = new Date(currentTime);

    const currentScheduleHour: ScheduleHour = scheduleHours.find((hour: ScheduleHour) => {
      startTime.setHours(...hour.start_time)
      endTime.setHours(...hour.end_time);
      return hour.week_day === currentDayOfWeek && startTime <= currentTime && currentTime <= endTime;
    });

    let nextScheduleHour;
    if (currentScheduleHour) {
      nextScheduleHour = scheduleHours.find((hour: ScheduleHour) => {
        return hour.week_day >= currentDayOfWeek && hour.n_hour == currentScheduleHour.n_hour + 1;
      });
    }
    else {
      startTime.setHours(...startHour.start_time);
      const add = currentTime <= startTime ? 0 : 1;
      const day = currentDayOfWeek >= 4 ? 0 : currentDayOfWeek + add;
      nextScheduleHour = scheduleHours.find((hour: ScheduleHour) => {
        return hour.week_day === day && hour.n_hour === 0;
      });
    }

    // Actualiza el estado con el horario actual y el próximo
    setCurrentScheduleHour(currentScheduleHour);
    setNextScheduleHour(nextScheduleHour);
  };

  const formatTime = (timeArray: number[]) => {
    const hours = timeArray[0].toString().padStart(2, '0');
    const minutes = timeArray[1].toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    checkLogin();
    fetchAllData();
  }, []);

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  return (
    <div className="p-5">
      {currentScheduleHour && (
        <div className="bg-blue-100 p-4 rounded-lg mb-5">
          <h2 className="text-xl font-bold mb-2">Horario Actual</h2>
          <p><span className="font-bold">Día de la semana:</span> {daysOfWeek[currentScheduleHour.week_day]}</p>
          <p><span className="font-bold">Asignatura:</span> {currentScheduleHour.subject_name}</p>
          <p><span className="font-bold">Aula:</span> {currentScheduleHour.classroom_name}</p>
          <p><span className="font-bold">Hora de inicio:</span> {formatTime(currentScheduleHour.start_time)}</p>
          <p><span className="font-bold">Hora de fin:</span> {formatTime(currentScheduleHour.end_time)}</p>
        </div>
      )}
      {nextScheduleHour && (
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Próximo Horario</h2>
          <p><span className="font-bold">Día de la semana:</span> {daysOfWeek[nextScheduleHour.week_day]}</p>
          <p><span className="font-bold">Asignatura:</span> {nextScheduleHour.subject_name}</p>
          <p><span className="font-bold">Aula:</span> {nextScheduleHour.classroom_name}</p>
          <p><span className="font-bold">Hora de inicio:</span> {formatTime(nextScheduleHour.start_time)}</p>
          <p><span className="font-bold">Hora de fin:</span> {formatTime(nextScheduleHour.end_time)}</p>
        </div>
      )}
    </div>
  );
}

export default TeachersCurrentSchedule;
