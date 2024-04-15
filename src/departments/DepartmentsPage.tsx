import React, { useEffect, useState } from 'react';
import { Department } from './Department';
import DepartmentList from './DepartmentList';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

interface DepartmentData {
  id?: string;
  data: {
    name: string;
  };
}

function DepartmentsPage() {
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
      throw new Error(errorData.error.message);
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

      if (await fetchData("count_teachers_by_department", { "id": department.id }) > 0) {
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

  const totalPages = Math.ceil(totalDepartments / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="items-center justify-center bg-gray-500">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Departamentos</h1>
      </div>
      <DepartmentList onCreate={handleCreateOrUpdateDepartment} onSave={handleCreateOrUpdateDepartment} departments={departments} onDelete={handleDeleteDepartment} />
      <div className="flex items-center justify-center space-x-4">
        <select value={itemsPerPage} onChange={handleItemsPerPageChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
          {[5, 10, 20, 50, 0].map((value, index) => (
            <option key={index} value={value}>{value === 0 ? "Todos" : value}</option>
          ))}
        </select>
        <button
          onClick={() => handlePagination(1)}
          disabled={currentPage === 1 || itemsPerPage === 0}
          className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}>
          Primera
        </button>
        <button
          onClick={() => handlePagination(currentPage - 1)}
          disabled={currentPage === 1 || itemsPerPage === 0}
          className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}>
          Anterior
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
          <button
            key={page}
            onClick={() => handlePagination(page)}
            className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${currentPage === page && 'bg-blue-700'}`}>
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePagination(currentPage + 1)}
          disabled={currentPage === totalPages || itemsPerPage === 0}
          className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${(currentPage === totalPages || itemsPerPage === 0) && 'opacity-50 cursor-not-allowed'}`}>
          Siguiente
        </button>
        <button
          onClick={() => handlePagination(totalPages)}
          disabled={currentPage === totalPages || itemsPerPage === 0}
          className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${(currentPage === totalPages || itemsPerPage === 0) && 'opacity-50 cursor-not-allowed'}`}>
          Última
        </button>
      </div>
    </div>
  );
}

export default DepartmentsPage;