import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ScheduleHour } from '../schedules/ScheduleHour';
import { CenterScheduleHour } from '../schedules/CenterScheduleHour';

function TeachersCurrentSchedule() {
  const navigate = useNavigate();
  const [currentScheduleHour, setCurrentScheduleHour] = useState<ScheduleHour | null>(null);
  const [nextScheduleHour, setNextScheduleHour] = useState<ScheduleHour | null>(null);
  const [centerScheduleHours, setCenterScheduleHours] = useState<[CenterScheduleHour] | null>(null);

  const notify = (message: string) => {
    toast(message, { position: "top-center" })
  }

  const fetchData = async (method: string, params: object) => {
    try {
      let body = JSON.stringify({
        "id": 1,
        "method": method,
        "params": params
      })
      console.log(body);
      const response = await fetch('http://127.0.0.1:8081/api/rpc', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
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

  const fetchAllData = async () => {

    const centerScheduleHours: [CenterScheduleHour] = await fetchData("list_center_schedule_hours", {
      "filters": {
        // "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": [
          "n_hour",
          "week_day"
      ]
      }
    });
    if (!centerScheduleHours) return;
    setCenterScheduleHours(centerScheduleHours);
    const schedule = await fetchData("get_user_schedule", {});
    if (!schedule) return;
    const scheduleHours = await fetchData("list_schedule_hours", {
      "filters": {
        "schedule_id": schedule.id
      },
      "list_options": {
        "order_bys": [
          "n_hour",
          "week_day"
      ]
      }
    });
    if (!scheduleHours) return;

    // Obtén la hora y el día de la semana actuales
    const specificDate = new Date('2024-04-26T12:35:00'); // Año-Mes-DíaTHora:Minuto:Segundo
    const probando = false;
    const currentTime = probando ? specificDate : new Date();
    const currentDayOfWeek = (currentTime.getDay() + 6) % 7;

    // Filtra los horarios para encontrar el horario actual y el próximo
    const startTime = new Date(currentTime);
    const endTime = new Date(currentTime);

    const current_hour = centerScheduleHours.find((hour: CenterScheduleHour) => {
      startTime.setHours(...hour.start_time)
      endTime.setHours(...hour.end_time);
      return hour.week_day === currentDayOfWeek && startTime <= currentTime && currentTime <= endTime;
    });

    let currentScheduleHour: ScheduleHour;
    let nextScheduleHour;
    if (current_hour) {
      currentScheduleHour = scheduleHours.find((hour: ScheduleHour) => {
        return hour.week_day === currentDayOfWeek && current_hour.n_hour === hour.n_hour;
      });

      if (currentScheduleHour) {
        setCurrentScheduleHour(currentScheduleHour);
        nextScheduleHour = scheduleHours.find((hour: ScheduleHour) => {
          return hour.week_day >= currentDayOfWeek && hour.n_hour === currentScheduleHour?.n_hour + 1;
        });
      }
      else {
        const add = current_hour.n_hour >= (centerScheduleHours.length - 1) ? 0 : 1;
        const day = currentDayOfWeek >= 4 ? 0 : currentDayOfWeek + add;
        nextScheduleHour = scheduleHours.find((hour: ScheduleHour) => {
          return hour.week_day === day && hour.n_hour === 0;
        });
      }
    }
    else {
      const firstClassTime = new Date();
      console.log(centerScheduleHours);
      firstClassTime.setHours(...centerScheduleHours[0].start_time)
      if (currentTime < firstClassTime && currentDayOfWeek < 5) {
        nextScheduleHour = scheduleHours.find((hour: ScheduleHour) => {
          return hour.week_day === currentDayOfWeek && hour.n_hour === 0;
        });
      } else {
        const day = currentDayOfWeek >= 4 ? 0 : currentDayOfWeek + 1;
        nextScheduleHour = scheduleHours.find((hour: ScheduleHour) => {
          return hour.week_day === day && hour.n_hour === 0;
        });
      }
    }

    // Actualiza el estado con el horario actual y el próximo
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
          <p><span className="font-bold">Hora de inicio:</span> {centerScheduleHours && currentScheduleHour ? formatTime(centerScheduleHours[currentScheduleHour.n_hour].start_time) : ''}</p>
          <p><span className="font-bold">Hora de fin:</span> {centerScheduleHours && currentScheduleHour ? formatTime(centerScheduleHours[currentScheduleHour.n_hour].end_time) : ''}</p>
          <p><span className="font-bold">Observaciones:</span> {currentScheduleHour.notes}</p>
        </div>
      )}
      {nextScheduleHour && (
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Próximo Horario</h2>
          <p><span className="font-bold">Día de la semana:</span> {daysOfWeek[nextScheduleHour.week_day]}</p>
          <p><span className="font-bold">Asignatura:</span> {nextScheduleHour.subject_name}</p>
          <p><span className="font-bold">Aula:</span> {nextScheduleHour.classroom_name}</p>
          <p><span className="font-bold">Hora de inicio:</span> {centerScheduleHours && nextScheduleHour ? formatTime(centerScheduleHours[nextScheduleHour.n_hour].start_time) : ''}</p>
          <p><span className="font-bold">Hora de fin:</span> {centerScheduleHours && nextScheduleHour ? formatTime(centerScheduleHours[nextScheduleHour.n_hour].end_time) : ''}</p>
          <p><span className="font-bold">Observaciones:</span> {nextScheduleHour.notes}</p>
        </div>
      )}
    </div>
  );
}

export default TeachersCurrentSchedule;
