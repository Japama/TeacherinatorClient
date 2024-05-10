import React, { useEffect, useState } from 'react';
import { Department } from './Department';
import DepartmentList from './DepartmentList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../auth/AuthContext';
import { checkLogin } from '../auth/AuthHelpers';

interface DepartmentData {
  id?: number;
  data: {
    name: string;
  };
}

function DepartmentsPage() {
  const { state, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalDepartments, setTotalDepartments] = useState(0);
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

  async function fetchDepartments() {
    const departmentsResponse = await fetchData("list_departments", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? totalDepartments : itemsPerPage
      }
    });
    if (departmentsResponse) {
      setDepartments(departmentsResponse);
    }
  }

  async function fetchAllDepartments() {
    const allDepartmentss = await fetchData("list_departments", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id"
      }
    });

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

    const responseData = await fetchData(method, data);

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

      if (await fetchData("count_users_by_department", { "id": department.id }) > 0) {
        notify("No se puede borrar el departamento porque hay docentes que pertenecen a él");
        return;
      }

      await fetchData("delete_department", { "id": department.id });
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

  useEffect(() => {
    checkLogin(getCurrentUser, navigate);
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