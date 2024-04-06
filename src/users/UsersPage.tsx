import React, { useEffect, useState } from 'react';
import { User } from './User';
import UserList from './UserList';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Teacher } from './Teacher';


function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const saveUser = (user: User) => {
    let updatedUsers = users.map((u: User) => {
      return u.id === user.id ? user : u;
    });
    setUsers(updatedUsers);
  };

  const getIsTeacher = (user_id: string) => {
    return teachers.find(t => t.user_id === user_id);
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
  

  useEffect(() => {
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
        }
      }
    };

    fetchAllData();

    if (itemsPerPage == 0 || itemsPerPage > totalUsers)
      setCurrentPage(1);

    if ((itemsPerPage * currentPage) > totalUsers + itemsPerPage)
      setCurrentPage(1);

  }, [currentPage, itemsPerPage]);


  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const usersWithTeachers = users.map(user => new User({ ...user, teacher: user.id ? getIsTeacher(user.id) : false }));

  return (
    <div className="items-center justify-center bg-gray-500">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Usuarios</h1>
      </div>
      <UserList onSave={saveUser} users={usersWithTeachers} />
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
