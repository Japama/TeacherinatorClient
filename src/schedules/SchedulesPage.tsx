import React, { useEffect, useState } from 'react';
import { Schedule } from './Schedule';
import ScheduleList from './ScheduleList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import ScheduleDetails from './ScheduleDetails';
import { ScheduleHour } from './ScheduleHour';
import { useAuth } from '../auth/AuthContext';
// import { Teacher } from '../teachers/Teacher';
import { User } from '../users/User';
import { Group } from '../groups/Group';
import { CenterScheduleHour } from '../centerSchedules/CenterScheduleHour';
import { checkLogin } from '../auth/AuthHelpers';

interface ScheduleData {
  id?: number;
  data: {
    course: number;
  };
}

interface ScheduleHourData {
  id?: number;
  data: {
    schedule_id: number | undefined;
    classroom_name: string;
    subject_name: string;
    week_day: number;
    n_hour: number;
    course: number;
  };
}

function SchedulesPage() {
  const { state, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [scheduleHours, setScheduleHours] = useState<ScheduleHour[]>([]);
  const [centerScheduleHours, setCenterScheduleHours] = useState<CenterScheduleHour[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditHourOpen, setIsModalEditHourOpen] = useState(false);

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

  async function fetchSchedules() {
    const centerScheduleHoursResponse = await fetchData("list_center_schedule_hours", {
      "filters": {
      },
      "list_options": {
        "order_bys": "n_hour"
      }
    });
    if (centerScheduleHoursResponse) {
      setCenterScheduleHours(centerScheduleHoursResponse);
    }

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

    const usersResponse = await fetchData("list_users", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {}
    });


    const groupsResponse = await fetchData("list_groups", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {}
    });


    if (usersResponse && schedulesResponse && groupsResponse) {
      const scheduleWithUsers = schedulesResponse.map((schedule: Schedule) => {
        const userMap = new Map(usersResponse.map((user: User) => [user.id, user]));
        const user = userMap.get(schedule.user_id);
        if (user) {
          schedule.user = new User(user);
        }

        return new Schedule(schedule);
      });

      const schedulesWithAllData = scheduleWithUsers.map((schedule: Schedule) => {
        const groupsMap = new Map(groupsResponse.map((group: Group) => [group.id, group]));
        const group = groupsMap.get(schedule.group_id);
        if (group) {
          schedule.group = new Group(group);
        }

        return new Schedule(schedule);
      });

      setSchedules(schedulesWithAllData);
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

  async function fetchScheduleHoures(scheduleId: number) {
    try {
      const scheduleHoursResponse = await fetchData("list_schedule_hours", {
        "filters": {
          "schedule_id": scheduleId
        }
      });
      if (scheduleHoursResponse) {
        setScheduleHours(scheduleHoursResponse);
      }
    } catch (error) {
      console.error("Error fetching schedule hours:", error);
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
    }
    fetchAllData();
  };

  const handleCreateOrUpdateScheduleHour = async (schedule: ScheduleHour) => {
    const update = schedule.id ? true : false;
    const method = update ? "update_schedule_hour" : "create_schedule_hour";
    const data: ScheduleHourData = {
      data: {
        schedule_id: schedule.schedule_id,
        classroom_name: schedule.classroom_name,
        subject_name: schedule.subject_name,
        week_day: schedule.week_day,
        n_hour: schedule.n_hour,
        course: schedule.course
      }
    };

    if (update) {
      data.id = schedule.id;
    }

    const responseData = await fetchData(method, data);

    if (!responseData.id ? true : false) {
      console.error(`Error al ${method === "update_schedule_hour" ? "actualizar" : "crear"} el departamento`);
    }

    if (selectedSchedule)
      await handleViewScheduleDetails(selectedSchedule);
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

  const handleDeleteScheduleHour = async (scheduleHour: ScheduleHour) => {
    try {
      await fetchData("delete_schedule_hour", { "id": scheduleHour.id });
      if (schedules.length === 1) {
        setCurrentPage(currentPage - 1);
      }
      await fetchScheduleHoures(selectedSchedule?.id ? selectedSchedule?.id : 0);
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
    await fetchScheduleHoures(schedule.id ? schedule.id : 0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseModalEditHour = () => {
    setIsModalEditHourOpen(false);
  };

  useEffect(() => {
    checkLogin(getCurrentUser, navigate);
    fetchAllData();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalSchedules / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="flex-grow items-center justify-center bg-transparent w-10/12 mx-auto mt-8">
      <div className='m-4  pt-auto text-3xl font-semibold text-white'>
        <h1>Horarios</h1>
      </div>
      <ScheduleList onCreate={handleCreateOrUpdateSchedule} onSave={handleCreateOrUpdateSchedule} schedules={schedules} onDelete={handleDeleteSchedule} onViewDetails={handleViewScheduleDetails} />
      <Pagination itemsPerPage={itemsPerPage} handleItemsPerPageChange={handleItemsPerPageChange} currentPage={currentPage} handlePagination={handlePagination} endPage={endPage} startPage={startPage} totalPages={totalPages} />
      {selectedSchedule && (
        <ScheduleDetails isOpen={isModalOpen} isModalEditHourOpen={isModalEditHourOpen} schedule={selectedSchedule} scheduleHours={scheduleHours} centerScheduleHours={centerScheduleHours} onClose={handleCloseModal} onCloseEdit={handleCloseModalEditHour} onEditScheduleHour={handleCreateOrUpdateScheduleHour} onDelete={handleDeleteScheduleHour} />
      )}

    </div>
  );
}

export default SchedulesPage;

