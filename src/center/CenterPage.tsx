import React from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function CentersPage() {
  const navigate = useNavigate();

  const notify = (message: string) => {
    toast(message, { position: "top-center" });
  }

  const handleNavigation = (path: string) => {
    navigate(path);
  }

  return (
<div className="flex-grow items-center justify-center bg-transparent w-10/12 mx-auto mt-8">
      <div className='m-4 pt-auto text-3xl font-semibold text-white'>
        <h1>Centro</h1>
      </div>
      <div className="flex justify-around mt-8">
        <button 
          onClick={() => handleNavigation('/classrooms')}
          className="w-1/4 h-48 bg-blue-500 text-white rounded-lg shadow-lg flex items-center justify-center text-xl font-bold transition duration-300 hover:bg-blue-700"
        >
          Aulas
        </button>
        <button 
          onClick={() => handleNavigation('/classroomtypes')}
          className="w-1/4 h-48 bg-green-500 text-white rounded-lg shadow-lg flex items-center justify-center text-xl font-bold transition duration-300 hover:bg-green-700"
        >
          Tipos de Aulas
        </button>
        <button 
          onClick={() => handleNavigation('/buildings')}
          className="w-1/4 h-48 bg-red-500 text-white rounded-lg shadow-lg flex items-center justify-center text-xl font-bold transition duration-300 hover:bg-red-700"
        >
          Edificios
        </button>
      </div>
    </div>
  );
}

export default CentersPage;
