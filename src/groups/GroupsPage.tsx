import React, { useEffect, useState } from 'react';
import { Group } from './Group';
import GroupList from './GroupList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../auth/AuthContext';
import { User } from '../users/User';
import { checkLogin } from '../auth/AuthHelpers';

interface GroupData {
  id?: number;
  data: {
    course: number;
    stage: number;
    year: number;
    letter: string;
    tutor_name: string;
  };
}



function GroupsPage() {
  const { state, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalGroups, setTotalGroups] = useState(0);
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

  async function fetchGroups() {
    const usersResponse = await fetchData("list_users", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {}
    });

    if (usersResponse) {
      setUsers(usersResponse);
      const groupsResponse = await fetchData("list_groups", {
        "filters": {
          "id": { "$gte": 1000 }
        },
        "list_options": {
          "order_bys": "id",
          "offset": (currentPage - 1) * itemsPerPage,
          "limit": itemsPerPage === 0 ? totalGroups : itemsPerPage
        }
      });
      if (groupsResponse) {
        setGroups(groupsResponse);
      }
    }
  }

  async function fetchAllGroups() {
    const allGroupss = await fetchData("list_groups", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id"
      }
    });

    if (allGroupss) {
      setTotalGroups(allGroupss.length);
    }
  }

  const fetchAllData = async () => {
    await fetchAllGroups();
    await fetchGroups();
  }

  const handleCreateOrUpdateGroup = async (group: Group) => {
    const update = group.id ? true : false;
    const method = update ? "update_group" : "create_group";
    const data: GroupData = {
      data: {
        course: group.course,
        stage: group.stage,
        year: Number(group.year),
        letter: group.letter,
        tutor_name: group.tutor_name
      }
    };

    if (update) {
      data.id = group.id;
    } else {
      const checkResponse = await fetchData("check_group_exists", data);
      if (checkResponse) {
        notify("El grupo ya existe");
        return;
      }
    }


    const responseData = await fetchData(method, data);

    if (!responseData.id ? true : false) {
      console.error(`Error al ${method === "update_group" ? "actualizar" : "crear"} el departamento`);
    }

    if (update) {
      let updatedGroups = groups.map((u: Group) => {
        return u.id === group.id ? group : u;
      });
      setGroups(updatedGroups);
    } else {
      if (groups.length === itemsPerPage) {
        setCurrentPage(currentPage + 1);
      }
    }
    fetchAllData();
  };

  const handleDeleteGroup = async (group: Group) => {
    try {

      await fetchData("delete_group", { "id": group.id });
      if (groups.length === 1) {
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
    if (n === 0 || n > totalGroups)
      setCurrentPage(1);

    if ((n * currentPage) > totalGroups + n && currentPage > 1) {
      const pagina = Math.ceil(totalGroups / n);
      setCurrentPage(pagina);
    }
  };

  useEffect(() => {
    checkLogin(getCurrentUser, navigate);
    fetchAllData();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalGroups / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="items-center justify-center  bg-transparent w-10/12 mx-auto">
      <div className='m-4  pt-auto text-3xl font-semibold text-white'>
        <h1>Grupos</h1>
      </div>
      <GroupList groups={groups} users={users} onCreate={handleCreateOrUpdateGroup} onSave={handleCreateOrUpdateGroup} onDelete={handleDeleteGroup} />
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

export default GroupsPage;