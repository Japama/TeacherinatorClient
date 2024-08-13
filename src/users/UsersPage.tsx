import React, { useEffect, useState } from 'react';
import { User } from './User';
import UserList from './UserList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../auth/AuthContext';
import { Department } from '../departments/Department';
import { checkLogin } from '../auth/AuthHelpers';
import { Teacher } from '../teachers/Teacher';

interface UserData {
  id?: number;
  data: {
    username: string;
    is_admin: boolean;
    pwd: string;
    active: boolean;
    department_id: number;
    in_center: boolean;
    last_checkin: [number, number, number, number];
    last_checkout: [number, number, number, number];
    substituting_id: number | undefined;
    substitutions: number;
  };
}

function UsersPage() {
  const { state, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [departmens, setDepartmens] = useState<Department[]>([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Estados para los filtros
  const [filters, setFilters] = useState({
    username: '',
    is_admin: '',
    department: '',
    teacher: '',
    active: ''
  });

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

  async function fetchAllUsers() {
    const allUsers = await fetchData("list_users", {
      "filters": buildFilters(),
      "list_options": {
        "order_bys": "id"
      }
    });
    if (allUsers) {
      setTotalUsers(allUsers.length);
    }
  }

  async function fetchUsers() {
    const usersResponse = await fetchData("list_users", {
      "filters": buildFilters(),
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? totalUsers : itemsPerPage
      }
    });

    if (usersResponse) {
      const departmentsResponse = await fetchData("list_departments", {
        "filters": {
          "id": { "$gte": 1 }
        },
        "list_options": {
          "order_bys": "id"
        }
      });
      if (departmentsResponse) {
        setDepartmens(departmentsResponse);
        const departmentsMap = new Map(departmentsResponse.map((dept: Department) => [dept.id, dept]));
        const usersWithDetails = usersResponse.map((user: User) => {
          const department = departmentsMap.get(user.department_id);

          if (department) {
            user.department = new Department(department);
          }
          return new User(user);
        });
        setUsers(usersWithDetails);
      } else {
        setUsers(usersResponse);
      }
    }
  }


  const buildFilters = () => {
    const filtersObj: any = {};

    if (filters.username) {
      filtersObj.username = { "$contains": filters.username };
    }
    if (filters.is_admin !== '') {
      filtersObj.is_admin = { "$eq": filters.is_admin === 'true' };
    }
    if (filters.department) {
      filtersObj.department_id = { "$eq": parseInt(filters.department) };
    }
    if (filters.teacher !== '') {
      if (filters.teacher === 'true') {
        filtersObj.department_id = { "$not": 1 };
      } else {
        filtersObj.department_id = { "$eq": 1 };
      }
    }
    if (filters.active !== '') {
      filtersObj.active = filters.active === 'true';
    }

    // Agregar cualquier otro filtro necesario aquí
    filtersObj.id = { "$gte": 1000 };

    return filtersObj;
  }



  const fetchAllData = async () => {
    await fetchAllUsers();
    await fetchUsers();
  };

  const handleCreateOrUpdateUser = async (user: User, changePassword: boolean) => {
    const update = user.id ? true : false;

    const method = !update ? "create_user" : "update_user_pwd";
    const data: UserData = {
      data: {
        username: user.username,
        pwd: user.pwd,
        is_admin: user.is_admin,
        in_center: user.in_center,
        last_checkin: user.last_checkin,
        last_checkout: user.last_checkout,
        active: user.active,
        department_id: user.department_id,
        substituting_id: user.substituting_id ? user.substituting_id : undefined,
        substitutions: user.substitutions
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
      fetchAllData()
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

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value
    }));
    setCurrentPage(1);
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
    const checkPage = () => {

      if (itemsPerPage === 0 || itemsPerPage > totalUsers)
        setCurrentPage(1);

      if ((itemsPerPage * currentPage) >= totalUsers + itemsPerPage && currentPage > 1)
        setCurrentPage(currentPage - 1);
    }
    checkLogin(getCurrentUser, navigate);
    checkPage();
    fetchAllData(); // Se ejecutará solo una vez cuando el componente se monta
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAllData(); // Llama a la función para obtener los datos filtrados
  }, [filters]); // Ejecuta el efecto cada vez que `filters` cambie


  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="flex-grow items-center justify-center bg-transparent w-10/12 mx-auto mt-8">
      <div className='m-4 text-3xl font-semibold text-white'>
        <h1>Usuarios</h1>
      </div>
      <UserList onCreate={handleCreateOrUpdateUser} onSave={handleCreateOrUpdateUser} onDelete={handleDeleteUser} users={users} checkUsername={checkUsername} departments={departmens} filters={filters} onFilterChange={handleFilterChange} />
      <Pagination itemsPerPage={itemsPerPage} handleItemsPerPageChange={handleItemsPerPageChange} currentPage={currentPage} handlePagination={handlePagination} endPage={endPage} startPage={startPage} totalPages={totalPages} />
    </div>
  );
}

export default UsersPage;
