import React, { useEffect, useState } from 'react';
import { User } from './User';
import UserList from './UserList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../AuthContext';

interface UserData {
  id?: number;
  data: {
    username: string;
    isadmin: boolean;
    pwd: string;
  };
}

function UsersPage() {
  const { state } = useAuth();
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
      const errorData = await response.json();
      if (errorData.error.message === 'NO_AUTH') {
        state.isLoggedIn = false;
        navigate("/login");
      } else {
        throw new Error(errorData.error.message);
      }
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
    if (!state.isLoggedIn) {
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

  const checkUsername = async (username: String) => {
    const method = "check_duplicate_username";
    const params = { data: username };
    return await fetchData(method, params);
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
    <div className="flex-grow items-center justify-center bg-gray-500 w-10/12 mx-auto">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Usuarios</h1>
      </div>
      <UserList onCreate={handleCreateOrUpdateUser} onSave={handleCreateOrUpdateUser} onDelete={handleDeleteUser} users={users} checkUsername={checkUsername} />
      <Pagination itemsPerPage={itemsPerPage} handleItemsPerPageChange={handleItemsPerPageChange} currentPage={currentPage} handlePagination={handlePagination} endPage={endPage} startPage={startPage} totalPages={totalPages} />
    </div>
  );
}

export default UsersPage;
