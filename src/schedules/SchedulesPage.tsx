import React, { useEffect, useState } from 'react';
import { Schedule } from './Schedule';
import ScheduleList from './ScheduleList';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import ScheduleDetails from './ScheduleDetails';
import { ScheduleHour } from './ScheduleHour';

interface ScheduleData {
  id?: number;
  data: {
    course: number;
  };
}

function SchedulesPage() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [scheduleHours, setScheduleHours] = useState<ScheduleHour[]>([]); 

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
      throw new Error(errorData.error.message);
    }
  };

  async function fetchSchedules() {
    const schedulesResponse = await fetchData("list_schedules", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? totalSchedules : itemsPerPage
      }
    });
    if (schedulesResponse) {
      setSchedules(schedulesResponse);
    }
  }

  async function fetchAllSchedules() {
    const allScheduless = await fetchData("list_schedules", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id"
      }
    });

    if (allScheduless) {
      setTotalSchedules(allScheduless.length);
    }
  }

  const fetchAllData = async () => {
    await fetchAllSchedules();
    await fetchSchedules();
  }

  const handleCreateOrUpdateSchedule = async (schedule: Schedule) => {
    const update = schedule.id ? true : false;
    const method = update ? "update_schedule" : "create_schedule";
    const data: ScheduleData = {
      data: {
        course: schedule.course
      }
    };

    if (update) {
      data.id = schedule.id;
    }

    const responseData = await fetchData(method, data);

    if (!responseData.id ? true : false) {
      console.error(`Error al ${method === "update_schedule" ? "actualizar" : "crear"} el departamento`);
    }

    if (update) {
      let updatedSchedules = schedules.map((u: Schedule) => {
        return u.id === schedule.id ? schedule : u;
      });
      setSchedules(updatedSchedules);
    } else {
      if (schedules.length === itemsPerPage) {
        setCurrentPage(currentPage + 1);
      }
      fetchAllData();
    }
  };

  const handleDeleteSchedule = async (schedule: Schedule) => {
    try {

      if (await fetchData("count_teachers_by_schedule", { "id": schedule.id }) > 0) {
        notify("No se puede borrar el departamento porque hay docentes que pertenecen a él");
        return;
      }

      await fetchData("delete_schedule", { "id": schedule.id });
      if (schedules.length === 1) {
        setCurrentPage(currentPage - 1);
      }
      fetchAllData();
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message);
      }
    }
  };

  const handlePagination = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const n = Number(event.target.value);
    setItemsPerPage(n);
    if (n === 0 || n > totalSchedules)
      setCurrentPage(1);

    if ((n * currentPage) > totalSchedules + n && currentPage > 1) {
      const pagina = Math.ceil(totalSchedules / n);
      setCurrentPage(pagina);
    }
  };

  const handleViewScheduleDetails = async (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);

    try {
      const scheduleHoursResponse = await fetchData("list_schedule_hours", {
        "filters": {
          "schedule_id": schedule.id
        }
      });
      if (scheduleHoursResponse) {
        console.log(scheduleHoursResponse)
        setScheduleHours(scheduleHoursResponse);
      }
    } catch (error) {
      console.error("Error fetching schedule hours:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const checkLogin = () => {
    const miCookie = Cookies.get('loged_in');
    if (miCookie !== "true") {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkLogin();
    fetchAllData();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalSchedules / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="items-center justify-center bg-gray-500 w-10/12 mx-auto">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Horarios</h1>
      </div>
      <ScheduleList onCreate={handleCreateOrUpdateSchedule} onSave={handleCreateOrUpdateSchedule} schedules={schedules} onDelete={handleDeleteSchedule} onViewDetails={handleViewScheduleDetails} />
      <Pagination
        itemsPerPage={itemsPerPage}
        handleItemsPerPageChange={handleItemsPerPageChange}
        currentPage={currentPage}
        handlePagination={handlePagination}
        endPage={endPage}
        startPage={startPage}
        totalPages={totalPages}
      />
      {selectedSchedule && (
        <ScheduleDetails isOpen={isModalOpen} onClose={handleCloseModal} schedule={selectedSchedule} scheduleHours={scheduleHours} />
      )}

    </div>
  );
}

export default SchedulesPage;