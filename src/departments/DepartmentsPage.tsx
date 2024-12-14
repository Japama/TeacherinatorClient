import React, { useEffect, useState } from 'react';
import { Department } from './Department';
import DepartmentList from './DepartmentList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../AuthContext';
import { apiService } from '../services/apiServices';

interface DepartmentData {
  id?: string;
  data: {
    name: string;
  };
}

function DepartmentsPage() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const notify = (message: string) => {
    toast(message, { position: "top-center" })
  }



  async function fetchDepartments() {
    const departmentsResponse = await apiService("list_departments", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? totalDepartments : itemsPerPage
      }
    }, navigate, state);
    if (departmentsResponse) {
      setDepartments(departmentsResponse);
    }
  }

  async function fetchAllDepartments() {
    const allDepartmentss = await apiService("list_departments", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id"
      }
    }, navigate, state);

    if (allDepartmentss) {
      setTotalDepartments(allDepartmentss.length);
    }
  }

  const fetchAllData = async () => {
    await fetchAllDepartments();
    await fetchDepartments();
  }

  const handleCreateOrUpdateDepartment = async (department: Department) => {
    const update = department.id ? true : false;
    const method = update ? "update_department" : "create_department";
    const data: DepartmentData = {
      data: {
        name: department.name
      }
    };

    if (update) {
      data.id = department.id;
    }

    const responseData = await apiService(method, data, navigate, state);

    if (!responseData.id ? true : false) {
      console.error(`Error al ${method === "update_department" ? "actualizar" : "crear"} el departamento`);
    }

    if (update) {
      let updatedDepartments = departments.map((u: Department) => {
        return u.id === department.id ? department : u;
      });
      setDepartments(updatedDepartments);
    } else {
      if (departments.length === itemsPerPage) {
        setCurrentPage(currentPage + 1);
      }
      fetchAllData();
    }
  };

  const handleDeleteDepartment = async (department: Department) => {
    try {

      if (await apiService("count_teachers_by_department", { "id": department.id }, navigate, state) > 0) {
        notify("No se puede borrar el departamento porque hay docentes que pertenecen a él");
        return;
      }

      await apiService("delete_department", { "id": department.id }, navigate, state);
      if (departments.length === 1) {
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
    if (n === 0 || n > totalDepartments)
      setCurrentPage(1);

    if ((n * currentPage) > totalDepartments + n && currentPage > 1) {
      const pagina = Math.ceil(totalDepartments / n);
      setCurrentPage(pagina);
    }
  };


  const checkLogin = () => {
    if (!state.isLoggedIn) {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkLogin();
    fetchAllData();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalDepartments / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="items-center justify-center bg-gray-500 w-10/12 mx-auto">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Departamentos</h1>
      </div>
      <DepartmentList onCreate={handleCreateOrUpdateDepartment} onSave={handleCreateOrUpdateDepartment} departments={departments} onDelete={handleDeleteDepartment} />
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

export default DepartmentsPage;