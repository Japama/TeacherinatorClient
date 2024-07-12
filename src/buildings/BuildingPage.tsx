import React, { useEffect, useState } from 'react';
import { Building } from './Building';
import BuildingList from './BuildingList';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Pagination from '../templates/Pagination';
import { useAuth } from '../auth/AuthContext';
import { checkLogin } from '../auth/AuthHelpers';

interface BuildingData {
  id?: number;
  data: {
    building_name: string;
  };
}

function BuildingsPage() {
  const { state, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [totalBuildings, setTotalBuildings] = useState(0);
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

  async function fetchBuildings() {
    const buildingsResponse = await fetchData("list_buildings", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id",
        "offset": (currentPage - 1) * itemsPerPage,
        "limit": itemsPerPage === 0 ? totalBuildings : itemsPerPage
      }
    });
    if (buildingsResponse) {
      setBuildings(buildingsResponse);
    }
  }

  async function fetchAllBuildings() {
    const allBuildingss = await fetchData("list_buildings", {
      "filters": {
        "id": { "$gte": 1000 }
      },
      "list_options": {
        "order_bys": "id"
      }
    });

    if (allBuildingss) {
      setTotalBuildings(allBuildingss.length);
    }
  }

  const fetchAllData = async () => {
    await fetchAllBuildings();
    await fetchBuildings();
  }

  const handleCreateOrUpdateBuilding = async (building: Building) => {
    const update = building.id ? true : false;
    const method = update ? "update_building" : "create_building";
    const data: BuildingData = {
      data: {
        building_name: building.building_name,
      }
    };

    if (update) {
      data.id = building.id;
    }

    const responseData = await fetchData(method, data);

    if (!responseData.id ? true : false) {
      console.error(`Error al ${method === "update_building" ? "actualizar" : "crear"} el departamento`);
    }

    if (update) {
      let updatedBuildings = buildings.map((u: Building) => {
        return u.id === building.id ? building : u;
      });
      setBuildings(updatedBuildings);
    } else {
      if (buildings.length === itemsPerPage) {
        setCurrentPage(currentPage + 1);
      }
      fetchAllData();
    }
  };

  const handleDeleteBuilding = async (building: Building) => {
    try {
      await fetchData("delete_building", { "id": building.id });
      if (buildings.length === 1) {
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
    if (n === 0 || n > totalBuildings)
      setCurrentPage(1);

    if ((n * currentPage) > totalBuildings + n && currentPage > 1) {
      const pagina = Math.ceil(totalBuildings / n);
      setCurrentPage(pagina);
    }
  };

  useEffect(() => {
    checkLogin(getCurrentUser, navigate);
    fetchAllData();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalBuildings / itemsPerPage);
  const paginationRange = 9;
  const halfPaginationRange = Math.floor(paginationRange / 2);
  const startPage = Math.max(1, currentPage - halfPaginationRange);
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
        <div className="flex-grow items-center justify-center bg-transparent w-10/12 mx-auto mt-8">
      <div className='m-4  pt-auto text-3xl font-semibold text-white'>
        <h1>Edificios</h1>
      </div>
      <BuildingList onCreate={handleCreateOrUpdateBuilding} onSave={handleCreateOrUpdateBuilding} buildings={buildings} onDelete={handleDeleteBuilding} />
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

export default BuildingsPage;