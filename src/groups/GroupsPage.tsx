import React, { useEffect, useState } from 'react';
import { Group } from './Group';
import GroupList from './GroupList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../AuthContext';
import { Teacher } from '../teachers/Teacher';
import { User } from '../users/User';
import { apiService } from '../services/apiServices';

interface GroupData {
  id?: number;
  data: {
    course: number;
  };
}

function GroupsPage() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [totalGroups, setTotalGroups] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const notify = (message: string) => {
    toast(message, { position: "top-center" })
  }



  async function fetchGroups() {
    
    const teachersResponse = await apiService("list_teachers", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
      }
    }, navigate, state);

    const usersResponse = await apiService("list_users", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {}
    }, navigate, state);

    if (teachersResponse && usersResponse) {
      const teachersWithDetails = teachersResponse.map((teacher: Teacher) => {
        const usersMap = new Map(usersResponse.map((user: User) => [user.id, user]));
        const user = usersMap.get(teacher.user_id);
        if (user) {
          teacher.user = new User(user);
        }

        return new Teacher(teacher);
      }, navigate, state);

      const groupsResponse = await apiService("list_groups", {
        "filters": {
          "id": { "$gte": 1000 }
        },
        "list_options": {
          "order_bys": "id",
          "offset": (currentPage - 1) * itemsPerPage,
          "limit": itemsPerPage === 0 ? totalGroups : itemsPerPage
        }
      }, navigate, state);
      if (groupsResponse) {
        // Mapear los grupos con los profesores
        const updatedGroups = groupsResponse.map((group: Group) => {
          const teacher = teachersWithDetails.find((teacher: Teacher) => teacher.user_id === group.tutor_id);
          if (teacher) {
            group.tutor_name = teacher.user.username;
          }
          return group;
        });
        setGroups(updatedGroups);
      }
    }
  }

  async function fetchAllGroups() {
    const allGroupss = await apiService("list_groups", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id"
      }
    }, navigate, state);

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
        course: group.course
      }
    };

    if (update) {
      data.id = group.id;
    }

    const responseData = await apiService(method, data, navigate, state);

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
      fetchAllData();
    }
  };

  const handleDeleteGroup = async (group: Group) => {
    try {

      if (await apiService("count_teachers_by_group", { "id": group.id }, navigate, state) > 0) {
        notify("No se puede borrar el departamento porque hay docentes que pertenecen a él");
        return;
      }

      await apiService("delete_group", { "id": group.id }, navigate, state);
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

  const checkLogin = () => {
    if (!state.isLoggedIn) {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkLogin();
    fetchAllData();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalGroups / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="items-center justify-center bg-gray-500 w-10/12 mx-auto">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
        <h1>Grupos</h1>
      </div>
      <GroupList onCreate={handleCreateOrUpdateGroup} onSave={handleCreateOrUpdateGroup} groups={groups} onDelete={handleDeleteGroup} />
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