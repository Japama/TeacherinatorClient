import React, { useEffect, useState } from 'react';
import { ClassroomType } from './ClassroomType';
import ClassroomTypeList from './ClassroomTypeList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../auth/AuthContext';
import { checkLogin } from '../auth/AuthHelpers';

interface ClassroomTypeData {
  id?: number;
  data: {
    type_name: string;
  };
}

function ClassroomTypesPage() {
  const { state, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [classroomtypes, setClassroomTypes] = useState<ClassroomType[]>([]);
  const [totalClassroomTypes, setTotalClassroomTypes] = useState(0);
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

  async function fetchClassroomTypes() {
    const classroomtypesResponse = await fetchData("list_classroom_types", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? totalClassroomTypes : itemsPerPage
      }
    });
    if (classroomtypesResponse) {
      setClassroomTypes(classroomtypesResponse);
    }
  }

  async function fetchAllClassroomTypes() {
    const allClassroomTypess = await fetchData("list_classroom_types", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id"
      }
    });

    if (allClassroomTypess) {
      setTotalClassroomTypes(allClassroomTypess.length);
    }
  }

  const fetchAllData = async () => {
    await fetchAllClassroomTypes();
    await fetchClassroomTypes();
  }

  const handleCreateOrUpdateClassroomType = async (classroomtype: ClassroomType) => {
    const update = classroomtype.id ? true : false;
    const method = update ? "update_classroom_type" : "create_classroom_type";
    const data: ClassroomTypeData = {
      data: {
        type_name: classroomtype.type_name,
      }
    };

    if (update) {
      data.id = classroomtype.id;
    }

    const responseData = await fetchData(method, data);

    if (!responseData.id ? true : false) {
      console.error(`Error al ${method === "update_classroom_type" ? "actualizar" : "crear"} el departamento`);
    }

    if (update) {
      let updatedClassroomTypes = classroomtypes.map((u: ClassroomType) => {
        return u.id === classroomtype.id ? classroomtype : u;
      });
      setClassroomTypes(updatedClassroomTypes);
    } else {
      if (classroomtypes.length === itemsPerPage) {
        setCurrentPage(currentPage + 1);
      }
      fetchAllData();
    }
  };

  const handleDeleteClassroomType = async (classroomtype: ClassroomType) => {
    try {

      if (await fetchData("count_classroom_by_classroom_type", { "id": classroomtype.id }) > 0) {
        notify("No se puede borrar el departamento porque hay docentes que pertenecen a él");
        return;
      }

      await fetchData("delete_classroom_type", { "id": classroomtype.id });
      if (classroomtypes.length === 1) {
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
    if (n === 0 || n > totalClassroomTypes)
      setCurrentPage(1);

    if ((n * currentPage) > totalClassroomTypes + n && currentPage > 1) {
      const pagina = Math.ceil(totalClassroomTypes / n);
      setCurrentPage(pagina);
    }
  };

  useEffect(() => {
    checkLogin(getCurrentUser, navigate);
    fetchAllData();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalClassroomTypes / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
        <div className="flex-grow items-center justify-center bg-transparent w-10/12 mx-auto mt-8">
      <div className='m-4  pt-auto text-3xl font-semibold text-white'>
        <h1>Tipos de aula</h1>
      </div>
      <ClassroomTypeList onCreate={handleCreateOrUpdateClassroomType} onSave={handleCreateOrUpdateClassroomType} classroomtypes={classroomtypes} onDelete={handleDeleteClassroomType} />
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

export default ClassroomTypesPage;