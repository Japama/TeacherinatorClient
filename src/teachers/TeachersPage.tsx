import React, { useEffect, useState } from 'react';
import TeacherList from './TeacherList';
import { useNavigate } from "react-router-dom";
import { Teacher } from './Teacher';
import { Department } from '../departments/Department';
import { User } from '../users/User';
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../AuthContext';

interface TeacherData {
  id?: string;
  data: {
    user_id: number;
    user: User | undefined;
    active: boolean;
    department_id: string;
    department: Department | undefined;
    username: string;
  };
}

function TeachersPage() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

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


  async function fetchAllTeachers() {
    const allTeachers = await fetchData("list_teachers", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id"
      }
    });
    if (allTeachers) {
      setAllTeachers(allTeachers)
    }
  }

  async function fetchTeachersWithDetail() {
    const teachersResponse = await fetchData("list_teachers", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? allTeachers.length : itemsPerPage
      }
    });

    const departmentsResponse = await fetchData("list_departments", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {}
    });


    const usersResponse = await fetchData("list_users", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {}
    });

    if (departmentsResponse && teachersResponse && usersResponse) {
      const departmentsMap = new Map(departmentsResponse.map((dept: Department) => [dept.id, dept]));
      const teachersWithDetails = teachersResponse.map((teacher: Teacher) => {
        const department = departmentsMap.get(teacher.department_id);
        const usersMap = new Map(usersResponse.map((user: User) => [user.id, user]));
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

      if (teachersWithDetails) {
        setTeachers(teachersWithDetails);
      }

      if (departmentsResponse) {
        setDepartments(departmentsResponse);
      }
      if (usersResponse) {
        setUsers(usersResponse);
      }
    }
  }

  const fetchAllData = async () => {
    await fetchAllTeachers();
    await fetchTeachersWithDetail();
  }

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

    if (!response.ok) {
      console.error(`Error al crear el usuario`);
    }
    const data = await response.json();
    return new User(data.result);
  };

  const handleCreateOrUpdateTeacher = async (teacher: Teacher) => {
    const update = teacher.id ? true : false;
    const method = update ? "update_teacher" : "create_teacher";
    const params: TeacherData = {
      data: {
        user_id: teacher.user_id,
        user: teacher.user,
        active: teacher.active,
        department_id: teacher.department_id,
        department: teacher.department,
        username: teacher.username
      }
    };

    if (update) {
      params.id = teacher.id;
    }

    const responseData = await fetchData(method, params);

    if (!responseData.id ? true : false) {
      console.error(`Error al ${method === "update_teacher" ? "actualizar" : "crear"} el docente`);
    } else if (!update && teachers.length === itemsPerPage) {
      setCurrentPage(currentPage + 1);
    }

    fetchAllData();
  };


  const handleDeleteTeacher = async (teacher: Teacher) => {
    try {
      await fetchData("delete_teacher", { "id": teacher.id });

      if (teachers.length === 1) {
        setCurrentPage(currentPage - 1);
      }
      fetchAllData();
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message);
      }
      notify("No se ha podido borrar el docente");
    }
  };


  const handlePagination = (newPage: number) => {
    setCurrentPage(newPage);
  };


  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const n = Number(event.target.value);
    setItemsPerPage(n);
    if (n === 0 || n > allTeachers.length)
      setCurrentPage(1);

    if ((n * currentPage) > allTeachers.length + n && currentPage > 1) {
      const pagina = Math.ceil(allTeachers.length / n);
      setCurrentPage(pagina);
    }
  };

  const checkUsername = async (username: String) => {
    const method = "check_duplicate_username";
    const params = { data: username };
    return await fetchData(method, params);
  };

  useEffect(() => {
    const checkLogin = () => {
      if (!state.isLoggedIn) {
        navigate("/login");
      }
    };



    const checkPage = () => {
      if (itemsPerPage === 0 || itemsPerPage > allTeachers.length)
        setCurrentPage(1);

      if ((itemsPerPage * currentPage) >= allTeachers.length + itemsPerPage && currentPage > 1)
        setCurrentPage(currentPage - 1);
    };


    checkLogin()
    fetchAllData();
    checkPage();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allTeachers.length / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="items-center justify-center bg-gray-500 w-10/12 mx-auto">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Docentes</h1>
      </div>
      <TeacherList
        onSave={handleCreateOrUpdateTeacher}
        onCreateTeacher={handleCreateOrUpdateTeacher}
        onCreateUser={createUser}
        onDelete={handleDeleteTeacher}
        checkUsername={checkUsername}
        teachers={teachers}
        allTeachers={allTeachers}
        departments={departments}
        users={users} />
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

export default TeachersPage;
