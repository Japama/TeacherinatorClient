import React, { useEffect, useState } from 'react';
import { Classroom } from './Classroom';
import ClassroomList from './ClassroomList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../auth/AuthContext';
import { checkLogin } from '../auth/AuthHelpers';

interface ClassroomData {
  id?: number;
  data: {
    building: string;
    floor: number;
    number: number;
    name: string;
    type_c: number;
    description: string;  
  };
}

function ClassroomsPage() {
  const { state, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [totalClassrooms, setTotalClassrooms] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  async function fetchClassrooms() {
    const classroomsResponse = await fetchData("list_classrooms", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? totalClassrooms : itemsPerPage
      }
    });
    if (classroomsResponse) {
      setClassrooms(classroomsResponse);
    }
  }

  async function fetchAllClassrooms() {
    const allClassroomss = await fetchData("list_classrooms", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id"
      }
    });

    if (allClassroomss) {
      setTotalClassrooms(allClassroomss.length);
    }
  }

  const fetchAllData = async () => {
    await fetchAllClassrooms();
    await fetchClassrooms();
  }

  const handleCreateOrUpdateClassroom = async (classroom: Classroom) => {
    const update = classroom.id ? true : false;
    const method = update ? "update_classroom" : "create_classroom";
    const data: ClassroomData = {
      data: {
        building: classroom.building,
        floor: classroom.floor,
        number: classroom.number,
        type_c: classroom.type_c,
        description: classroom.description,
        name: classroom.name
      }
    };

    if (update) {
      data.id = classroom.id;
    }

    const responseData = await fetchData(method, data);

    if (!responseData.id ? true : false) {
      console.error(`Error al ${method === "update_classroom" ? "actualizar" : "crear"} el departamento`);
    }

    if (update) {
      let updatedClassrooms = classrooms.map((u: Classroom) => {
        return u.id === classroom.id ? classroom : u;
      });
      setClassrooms(updatedClassrooms);
    } else {
      if (classrooms.length === itemsPerPage) {
        setCurrentPage(currentPage + 1);
      }
      fetchAllData();
    }
  };

  const handleDeleteClassroom = async (classroom: Classroom) => {
    try {

      if (await fetchData("count_users_by_classroom", { "id": classroom.id }) > 0) {
        notify("No se puede borrar el departamento porque hay docentes que pertenecen a él");
        return;
      }

      await fetchData("delete_classroom", { "id": classroom.id });
      if (classrooms.length === 1) {
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
    if (n === 0 || n > totalClassrooms)
      setCurrentPage(1);

    if ((n * currentPage) > totalClassrooms + n && currentPage > 1) {
      const pagina = Math.ceil(totalClassrooms / n);
      setCurrentPage(pagina);
    }
  };

  useEffect(() => {
    checkLogin(getCurrentUser, navigate);
    fetchAllData();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalClassrooms / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
        <div className="flex-grow items-center justify-center bg-transparent w-10/12 mx-auto mt-8">
      <div className='m-4  pt-auto text-3xl font-semibold text-white'>
        <h1>Aulas</h1>
      </div>
      <ClassroomList onCreate={handleCreateOrUpdateClassroom} onSave={handleCreateOrUpdateClassroom} classrooms={classrooms} onDelete={handleDeleteClassroom} />
      <Pagination
        itemsPerPage={itemsPerPage}
        handleItemsPerPageChange={handleItemsPerPageChange}
        currentPage={currentPage}
        handlePagination={handlePagination}
        endPage={endPage}
        startPage={startPage}
        totalPages={totalPages}
      />
    </div>
  );
}

export default ClassroomsPage;