import React, { useEffect, useState } from 'react';
import { User } from './User';
import UserList from './UserList';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

interface UserData {
  id?: string;
  data: {
    username: string;
    isadmin: boolean;
    pwd: string;
  };
}

function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const [totalUsers, setTotalUsers] = useState(0);
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
      console.error(`Error al obtener los ${method}`);
      return null;
    }
  };

  async function fetchUsers() {
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
      setUsers(usersResponse);
    }
  }

  async function fetchAllUsers() {
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
  }

  const fetchAllData = async () => {
    await fetchAllUsers();
    await fetchUsers();
  };
  const checkLogin = () => {
    const miCookie = Cookies.get('loged_in');
    if (miCookie !== "true") {
      navigate("/login");
    }
  };

  const handleCreateOrUpdateUser = async (user: User) => {
    const update = user.id ? true : false;
    const method = update ? "update_user_pwd" : "create_user";
    const data: UserData = {
      data: {
        username: user.username,
        isadmin: user.isadmin,
        pwd: user.pwd
      }
    };

    if (update) {
      data.id = user.id;
    }

    const responseData = await fetchData(method, data);

    if (!responseData.id ? true : false) {
      console.error(`Error al ${method === "update_user_pwd" ? "actualizar" : "crear"} el usuario`);
    }

    if (update) {
      let updatedUsers = users.map((u: User) => {
        return u.id === user.id ? user : u;
      });
      setUsers(updatedUsers);
    } else {
      if (users.length === itemsPerPage) {
        setCurrentPage(currentPage + 1);
      }
      fetchAllData();
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await fetchData("delete_user", { "id": user.id });

      if (users.length === 1) {
        setCurrentPage(currentPage - 1);
      }
      fetchAllData();
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message);
      }
      notify("No se ha podido borrar el usuario");
    }
  };

  const handlePagination = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const n = Number(event.target.value);
    setItemsPerPage(n);
    if (n === 0 || n > totalUsers)
      setCurrentPage(1);

    if ((n * currentPage) > totalUsers + n && currentPage > 1) {
      const pagina = Math.ceil(totalUsers / n);
      setCurrentPage(pagina);
    }
  };

  useEffect(() => {
    checkLogin();
    const checkPage = () => {

      if (itemsPerPage === 0 || itemsPerPage > totalUsers)
        setCurrentPage(1);

      if ((itemsPerPage * currentPage) >= totalUsers + itemsPerPage && currentPage > 1)
        setCurrentPage(currentPage - 1);
    }

    fetchAllData();
    checkPage();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="items-center justify-center bg-gray-500">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Usuarios</h1>
      </div>
      <UserList onCreate={handleCreateOrUpdateUser} onSave={handleCreateOrUpdateUser} onDelete={handleDeleteUser} users={users} />
      <div className="flex items-center justify-center space-x-4">
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
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

export default UsersPage;
