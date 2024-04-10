import React, { useEffect, useState } from 'react';
import { Department } from './Department';
import DepartmentList from './DepartmentList';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function DepartmentsPage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const saveDepartment = async (department: Department) => {
    let updatedDepartments = departments.map((u: Department) => {
      return u.id === department.id ? department : u;
    });
    setDepartments(updatedDepartments);
    // Actualiza el usuario en la base de datos
    const response = await fetch('http://127.0.0.1:8081/api/rpc', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": 1,
        "method": "update_department",
        "params": {
          "id": department.id,
          "data": {
            "name": department.name,
          }
        }
      }),
    });

    if (!response.ok) {
      console.error(`Error al actualizar el usuario`);
    }
  };

  const createDepartment = async (department: Department) => {
    // Actualiza el usuario en la base de datos
    const response = await fetch('http://127.0.0.1:8081/api/rpc', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": 1,
        "method": "create_department",
        "params": {
          "data": {
            "name": department.name,
          }
        }
      }),
    });

    if (!response.ok) {
      console.error(`Error al actualizar el usuario`);
    }
    if (departments.length === itemsPerPage) {
      setCurrentPage(currentPage + 1);
    }
    fetchAllData();
  };

  const handleDeleteDepartment = async (department: Department) => {
    try{
      await fetchData("delete_department", { "id": department.id });

      if (departments.length === 1) {
        setCurrentPage(currentPage - 1);
      }
      fetchAllData();  
    } catch (error){
      if(error instanceof Error)
      alert(error.message);
      alert("No se puede borrar el departamento porque hay docentes que pertenecen a el");
    }
  };

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

  const checkLogin = () => {
    const miCookie = Cookies.get('loged_in');
    if (miCookie !== "true") {
      navigate("/login");
    }
  };

  const fetchAllData = async () => {
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
      setDepartments(departmentsResponse)
    }
  }

  const checkPage = (fromCreate: boolean) => {

    
  }

  useEffect(() => {
    checkLogin();
    fetchAllData();
  }, [currentPage, itemsPerPage]);


  const handleChangeItems = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const n = Number(event.target.value);
    setItemsPerPage(n);
    if (n == 0 || n > totalDepartments)
      setCurrentPage(1);

    if ((n * currentPage) > totalDepartments + n && currentPage > 1) {
      const pagina = Math.ceil(totalDepartments / n);
      setCurrentPage(pagina);
    }
  };

  const totalPages = Math.ceil(totalDepartments / itemsPerPage);


  return (
    <div className="items-center justify-center bg-gray-500">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Departamentos</h1>
      </div>
      <DepartmentList onCreate={createDepartment} onSave={saveDepartment} departments={departments} onDelete={handleDeleteDepartment} />
      <div className="flex items-center justify-center space-x-4">
        <select value={itemsPerPage} onChange={handleChangeItems}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={0}>Todos</option>
        </select>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 || itemsPerPage === 0}
          className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}>
          Anterior
        </button>
        <span className="text-lg font-bold">Página {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || itemsPerPage === 0}
          className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${(currentPage === totalPages || itemsPerPage === 0) && 'opacity-50 cursor-not-allowed'}`}>
          Siguiente
        </button>
      </div>

    </div>
  );
}

export default DepartmentsPage;