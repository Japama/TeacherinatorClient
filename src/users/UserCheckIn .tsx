import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function UserCheckIn () {
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastActionTime, setLastActionTime] = useState('');

  const handleCheckIn = async () => {
    const method = isCheckedIn ? 'user_checkout' : 'user_checkin';
    const result = await fetchData(method, {});
    if (result) {
      setIsCheckedIn(!isCheckedIn);
      const date = new Date();
      // date.setHours(0);
      setLastActionTime(date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } else {
      notify('Error al realizar la acción');
    }
  };

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

  useEffect(() => {

    const checkLogin = () => {
      const loggedInCookie = Cookies.get('loged_in');
      if (loggedInCookie !== "true") {
        navigate("/login");
      }
      return true;
    };

    checkLogin();

    // Llama a get_current_user y establece el estado de isCheckedIn
    fetchData("get_current_user", {}).then(user => {
      if (user) {
        setIsCheckedIn(user.in_center);
        const lastAction = user.in_center ? user.last_checkin : user.last_checkout;

        // Crear un objeto Date con la fecha/hora
        const lastActionDate = new Date(0, 0, 0, lastAction[0], lastAction[1], lastAction[2]);

        // Añadir la diferencia horaria
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();
        const timezoneOffsetHours = timezoneOffsetMinutes / 60;
        lastActionDate.setHours(lastActionDate.getHours() - timezoneOffsetHours);

        // Convertir a hora local
        const lastActionTimeLocal = lastActionDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastActionTime(lastActionTimeLocal);

        let date = new Date();
        // date.setHours(15);
        // Si la última acción fue un check-in y la hora de la última acción es posterior a la hora actual, realiza un checkout automáticamente
        if (user.in_center && lastActionDate > date) {
          // handleCheckIn();
        }
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-2/3 bg-gradient-to-r from-blue-400 to-purple-600 py-36">
      <div className="p-6 rounded-lg shadow-lg bg-white max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Control de Asistencia</h1>
        <button
          onClick={handleCheckIn}
          className={`w-full text-lg font-semibold py-2 rounded-lg transition-colors duration-300 ${isCheckedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          {isCheckedIn ? 'Salir' : 'Entrar'}
        </button>
        {lastActionTime && (
          <p className="mt-4 text-gray-700">
            Última acción: <span className="font-semibold">{lastActionTime}</span> - {isCheckedIn ? 'Entrada' : 'Salida'}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCheckIn;
