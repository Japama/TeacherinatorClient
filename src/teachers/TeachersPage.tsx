import React, { useEffect, useState } from 'react';
import TeacherList from './TeacherList';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Teacher } from './Teacher';
import { Department } from '../departments/Department';
import { User } from '../users/User';

function TeachersPage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [totalTeachers, setTotalTeachers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);


  const fetchAllData = async () => {
    const miCookie = Cookies.get('loged_in');
    if (miCookie !== "true") {
      navigate("/login");
    } else {
      const allTeachers = await fetchData("list_teachers", {
        "filters": {
          "id": { "$gte": 1000 }
        },
        "list_options": {
          "order_bys": "id"
        }
      });
      if (allTeachers) {
        setTotalTeachers(allTeachers.length);
      }
    }

    const teachersResponse = await fetchData("list_teachers", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? totalTeachers : itemsPerPage
      }
    });

    const departmentsResponse = await fetchData("list_departments", {
      "filters": {
         "id": { "$gte": 1000 }
      },
      "list_options": {
      }
    });


    const usersResponse = await fetchData("list_users", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        // "order_bys": "id",
        // "offset": (currentPage - 1) * itemsPerPage,
        // "limit": itemsPerPage === 0 ? totalUsers : itemsPerPage
      }
    });


    const allTeachersResponse = await fetchData("list_teachers", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
      }
    });
    if (allTeachersResponse) {
      setAllTeachers(allTeachersResponse)
      // setUserDetails(usersResponse);
    }

    const departmentsMap = new Map(departmentsResponse.map((dept: Department) => [dept.id, dept]));
    const usersMap = new Map(usersResponse.map((user: User) => [user.id, user]));


    const teachersWithDetails = teachersResponse.map((teacher: Teacher) => {
      const department = departmentsMap.get(teacher.department_id);
      const user = usersMap.get(teacher.user_id);

      // Asegúrate de que el departamento y el usuario existen antes de intentar acceder a sus propiedades.
      if (department) {
        teacher.department = new Department(department);
      }
      if (user) {
        teacher.user = new User(user);
      }

      return new Teacher(teacher);
    });

    setTeachers(teachersWithDetails);

    // if (teachersResponse) {
    //   setTeachers(teachersResponse)
    //   // setTeacherDetails(teachersResponse);
    // }
    if (departmentsResponse) {
      setDepartments(departmentsResponse)
      // setTeacherDetails(teachersResponse);
    }
    if (usersResponse) {
      setUsers(usersResponse)
      // setUserDetails(usersResponse);
    }

  }


  const saveTeacher = async (teacher: Teacher) => {
    let updatedTeachers = teachers.map((u: Teacher) => {
      return u.id === teacher.id ? teacher : u;
    });
    setTeachers(updatedTeachers);

    // Actualiza el usuario en la base de datos
    const response = await fetch('http://127.0.0.1:8081/api/rpc', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": 1,
        "method": "update_teacher",
        "params": {
          "id": teacher.id,
          "data": {
            "user_id": teacher.user_id,
            "active": teacher.active,
            "department_id": teacher.department_id
          }
        }
      }),
    });

    fetchAllData();

    if (!response.ok) {
      console.error(`Error al actualizar el usuario`);
    }
  };


  const createUser = async (username: string) => {
    // Actualiza el usuario en la base de datos
    const response = await fetch('http://127.0.0.1:8081/api/rpc', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": 1,
        "method": "create_user",
        "params": {
          "data": {
            "username": username,
            "isadmin": false,
            "pwd": "Contraseña"
          }
        }
      }),
    });

    fetchAllData();

    if (!response.ok) {
      console.error(`Error al crear el usuario`);
    }
    const data = await response.json();

    fetchAllData();
    return new User(data.result);
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    await fetchData("delete_teacher", { "id": teacher.id });

    fetchAllData();
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
      console.error(`Error al obtener los ${method}`);
      return null;
    }
  };


  const createTeacher = async (teacher: Teacher) => {
    console.log("createTeacher");
    console.log(teacher);
    console.log("");
    let updatedTeachers = teachers.map((u: Teacher) => {
      return u.id === teacher.id ? teacher : u;
    });
    setTeachers(updatedTeachers);

    // Actualiza el usuario en la base de datos
    const response = await fetch('http://127.0.0.1:8081/api/rpc', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": 1,
        "method": "create_teacher",
        "params": {
          "data": {
            "user_id": teacher.user_id,
            "active": teacher.active,
            "department_id": teacher.department_id
          }
        }
      }),
    });

    fetchAllData();

    if (!response.ok) {
      console.error(`Error al actualizar el usuario`);
    }
  };


  useEffect(() => {
    const checkPage = () => {
      if (itemsPerPage == 0 || itemsPerPage > totalTeachers)
        setCurrentPage(1);

      if ((itemsPerPage * currentPage) >= totalTeachers + itemsPerPage && currentPage > 1)
        setCurrentPage(currentPage - 1);
    }

    fetchAllData();
    checkPage();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalTeachers / itemsPerPage);

  return (
    <div className="items-center justify-center bg-gray-500">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Docentes</h1>
      </div>
      <TeacherList
        onSave={saveTeacher}
        onCreateUser={createUser}
        onCreateTeacher={createTeacher}
        teachers={teachers}
        allTeachers={allTeachers}
        onDelete={handleDeleteTeacher}
        departments={departments}
        users={users} />

      <div className="flex items-center justify-center space-x-4 my-4">
        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
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

export default TeachersPage;
