import React, { useEffect, useState } from 'react';
import { User } from './User';
import UserList from './UserList';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Teacher } from '../teachers/Teacher';
import { Department } from '../departments/Department';

function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [teachersLoaded, setTteachersLoaded] = useState(false);
  const [departmentsLoaded, setDepartmentsLoaded] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [departments, setDepartments] = useState<Department[]>([]);

  const saveUser = (user: User) => {
    console.log(user);
    let updatedUsers = users.map((u: User) => {
      return u.id === user.id ? user : u;
    });
    console.log(updatedUsers);
    setUsers(updatedUsers);
  };

  const handleDeleteUser = async (user: User) => {
    await fetchData("delete_user", { "id": user.id });

    // Actualiza la lista de usuarios después de la eliminación
    const users = await fetchData("list_users", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? totalUsers : itemsPerPage
      }
    });
    if (users) {
      setUsers(users);
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
      console.error(`Error al obtener los ${method}`);
      return null;
    }
  };

  const setUserDetails = (users: User[]) =>{
    const usersWithDetails = users.map((user: User) => {
      const teacher = getTeacher(user.id ? user.id : '');
      const teacherDetails = teacher ? { id: teacher.id || '', department_id: teacher.department_id || '', active: teacher.active || false } : { id: '', department_id: '', active: false };
      return new User({
        ...user,
        teacher: teacherDetails.id,
        department: getDepartment(teacherDetails.department_id),
        active: teacherDetails.active
      });
    });
    setUsers(usersWithDetails);
  };

  const getTeacher = (user_id: string) => {
    const teacher = teachers.find(t => t.user_id === user_id);
    return teacher || { id: '', department_id: '', active: false }; // Devuelve un objeto Teacher predeterminado si no se encuentra el profesor
  };  
  
  const getDepartment = (depart_id: string) => {
    const department = departments.find(d => d.id === depart_id);
    return department ? department.name : '';
  };


  useEffect(() => {
    
  const checkPage = () => {

    if (itemsPerPage == 0 || itemsPerPage > totalUsers)
      setCurrentPage(1);

    if ((itemsPerPage * currentPage) >= totalUsers + itemsPerPage && currentPage > 1)
      setCurrentPage(currentPage - 1);

  }

    const fetchAllData = async () => {
      const miCookie = Cookies.get('loged_in');
      if (miCookie !== "true") {
        navigate("/login");
      } else {
        const allUsers = await fetchData("list_users", {
          "filters": {
            "id": { "$gte": 1000 }
          },
          "list_options": {
            "order_bys": "id"
          }
        });
        if (allUsers) {
          setTotalUsers(allUsers.length);
        }


        const teachers = await fetchData("list_teachers", {
          "filters": {
            "id": { "$gte": 1000 }
          },
          "list_options": {
            "order_bys": "id"
          }
        });
        if (teachers) {
          setTeachers(teachers);
          setTteachersLoaded(true);
        }

        const departments = await fetchData("list_departments", {
          "filters": {
            // "name": "Física"
          },
          "list_options": {
            // "order_bys": "name"
          }
        });
        if (departments) {
          setDepartments(departments);
          setDepartmentsLoaded(true);
        }
      };

      const usersResponse = await fetchData("list_users", {
        "filters": {
          "id": { "$gte": 1000 }
        },
        "list_options": {
          "order_bys": "id",
          "offset": (currentPage - 1) * itemsPerPage,
          "limit": itemsPerPage === 0 ? totalUsers : itemsPerPage
        }
      });
      if (usersResponse) {
        setUserDetails(usersResponse);
      }
    }

    fetchAllData();
    checkPage();
  }, [currentPage, itemsPerPage, teachersLoaded, departmentsLoaded]);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);
 
  return (
    <div className="items-center justify-center bg-gray-500">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Usuarios</h1>
      </div>
      <UserList onSave={saveUser} users={users} onDelete={handleDeleteUser} departments={departments}  />
      <div className="flex items-center justify-center space-x-4">
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

export default UsersPage;
