import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../auth/AuthContext';
import { checkLogin } from '../auth/AuthHelpers';
import { CenterScheduleHour } from './CenterScheduleHour';
import CenterScheduleHourList from './CenterScheduleHourList';

interface CenterScheduleHourData {
  id?: number;
  data: {
    // week_day: number;
    n_hour: number;
    start_time: [number, number, number, number]; // Tupla de números para representar la hora de inicio
    end_time: [number, number, number, number]; // Array de números para representar la hora de fin
    // course: number;
  };
}

function CenterScheduleHoursPage() {
  const { state, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedCenterScheduleHour, setSelectedCenterScheduleHour] = useState<CenterScheduleHour | null>(null);
  const [centerScheduleHours, setCenterScheduleHours] = useState<CenterScheduleHour[]>([]);
  const [maxHour, setMaxHour] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const notify = (message: string) => {
    toast(message, { position: "top-center" })
  }

  const fetchData = async (method: string, params: object) => {
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
      const errorData = await response.json();
      if (errorData.error.message === 'NO_AUTH') {
        state.isLoggedIn = false;
        navigate("/login");
      } else {
        throw new Error(errorData.error.message);
      }
    }
  };

  async function fetchCenterScheduleHours() {
    const centerScheduleHoursResponse = await fetchData("list_center_schedule_hours", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "n_hour",
        // "offset": (currentPage - 1) * itemsPerPage,
        // "limit": itemsPerPage === 0 ? totalCenterScheduleHours : itemsPerPage
      }
    });
    if (centerScheduleHoursResponse) {
      let maxHour = 0;
      centerScheduleHoursResponse.forEach((hour: CenterScheduleHour) => {
        maxHour = hour.n_hour >= maxHour ? hour.n_hour + 1 : maxHour;
      });
      setMaxHour(maxHour);
      setCenterScheduleHours(centerScheduleHoursResponse);
    }
  }

  const fetchAllData = async () => {
    await fetchCenterScheduleHours();
  }

  const handleCreateOrUpdateCenterScheduleHour = async (centerschedulehour: CenterScheduleHour) => {
    const update = centerschedulehour.id ? true : false;
    const method = update ? "update_center_schedule_hour" : "create_center_schedule_hour";
    const data: CenterScheduleHourData = {
      data: {
        // course: centerschedulehour.course,
        // week_day: centerschedulehour.week_day,
        n_hour: centerschedulehour.n_hour,
        start_time: centerschedulehour.start_time,
        end_time: centerschedulehour.end_time,
      }
    };

    if (update) {
      data.id = centerschedulehour.id;
    } else {
      const checkResponse = await fetchData("check_hour_exists", data);
      if (checkResponse) {
        notify("La hora ya existe");
        return;
      }
    }

    const centerScheduleHour = await fetchData(method, data);

    if (!centerScheduleHour.id ? true : false) {
      console.error(`Error al ${method === "update_center_schedule_hour" ? "actualizar" : "crear"} la hora`);
    }

    fetchAllData();
  };

  const handleDeleteCenterScheduleHour = async (centerschedulehour: CenterScheduleHour) => {
    try {
      await fetchData("delete_center_schedule_hour", { "id": centerschedulehour.id });
      if (centerScheduleHours.length === 1) {
        setCurrentPage(currentPage - 1);
      }
      fetchAllData();
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message);
      }
    }
  };

  const handleViewCenterScheduleHourDetails = async (centerschedulehour: CenterScheduleHour) => {
    setSelectedCenterScheduleHour(centerschedulehour);
    setIsModalOpen(true);

    try {
      const centerschedulehourHoursResponse = await fetchData("list_centerschedulehour_hours", {
        "filters": {
          "centerschedulehour_id": centerschedulehour.id
        }
      });
      if (centerschedulehourHoursResponse) {
        setCenterScheduleHours(centerschedulehourHoursResponse);
      }
    } catch (error) {
      console.error("Error fetching centerschedulehour hours:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    checkLogin(getCurrentUser, navigate);
    fetchAllData();
  }, [currentPage, itemsPerPage]);

  return (
<div className="flex-grow items-center justify-center bg-transparent w-10/12 mx-auto mt-8">
      <div className='m-4  pt-auto text-3xl font-semibold text-white'>
        <h1>Horario del centro</h1>
      </div>
      <CenterScheduleHourList centerScheduleHours={centerScheduleHours} maxHour={maxHour} onCreate={handleCreateOrUpdateCenterScheduleHour} onSave={handleCreateOrUpdateCenterScheduleHour} onDelete={handleDeleteCenterScheduleHour} onViewDetails={handleViewCenterScheduleHourDetails} />
    </div>
  );
}

export default CenterScheduleHoursPage;

