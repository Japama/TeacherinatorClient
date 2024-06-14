import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import Cookies from "js-cookie";
import { useAuth } from '../auth/AuthContext';
import { checkLogin } from '../auth/AuthHelpers';
import NavItem from './NavItem';

function Header() {
  const { state, logout, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [dropDownState, setDropDownState] = useState(false);
  const dropDownMenuRef = useRef<HTMLDivElement>(null);

  const logoutMethod = async (): Promise<void> => {
    try {
      await logout();
      Cookies.set('loged_in', 'false', { expires: 1 / 24 });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    confirmAlert({
      title: 'Confirmar salida',
      message: '¿Quieres salir?',
      buttons: [
        {
          label: 'Sí',
          onClick: () => logoutMethod()
        },
        {
          label: 'No',
        }
      ]
    });
  };

  useEffect(() => {
    const closeDropDown = (e: Event) => {
      if (!dropDownMenuRef?.current?.contains(e.target as Node)) {
        setDropDownState(false);
      }
    };

    document.addEventListener('mousedown', closeDropDown);
    checkLogin(getCurrentUser, navigate);
    return () => {
      document.removeEventListener('mousedown', closeDropDown);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white fixed top-0 w-screen shadow-lg z-10">
      <div className="text-xl font-semibold cursor-pointer transition-transform duration-200 hover:scale-105">
        <h2 onClick={() => navigate('/')}>Teacherinator</h2>
      </div>

      <ul className="hidden md:flex items-center gap-6">
        {state.isAdmin && <NavItem to="/users" label="Usuarios" />}
        {state.isAdmin && <NavItem to="/departments" label="Departamentos" />}
        {state.isAdmin && <NavItem to="/center" label="Centro" />}
        {state.isAdmin && <NavItem to="/classrooms" label="Aulas" />}
        {state.isAdmin && <NavItem to="/groups" label="Grupos" />}
        {state.isAdmin && <NavItem to="/schedules" label="Horarios" />}
        {state.isAdmin && <NavItem to="/centerSchedule" label="Horario centro" />}
        <NavItem to="/current" label="Tareas" />
        <NavItem to="/checkin" label="Fichar" />
        <li className="bg-red-500 rounded-md px-4 py-2 transition duration-300 hover:bg-red-700">
          <button onClick={handleClick} className="text-white">Salir</button>
        </li>
      </ul>

      <div ref={dropDownMenuRef} onClick={() => setDropDownState(!dropDownState)} className="relative md:hidden cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
        {dropDownState && (
          <ul className="absolute right-0 top-10 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg flex flex-col w-48 text-black dark:text-white">
            {state.isAdmin && <NavItem to="/users" label="Usuarios" />}
            {state.isAdmin && <NavItem to="/departments" label="Departamentos" />}
            {state.isAdmin && <NavItem to="/center" label="Centro" />}
            {state.isAdmin && <NavItem to="/classrooms" label="Aulas" />}
            {state.isAdmin && <NavItem to="/schedules" label="Horarios" />}
            {state.isAdmin && <NavItem to="/centerSchedule" label="Horario centro" />}
            <NavItem to="/current" label="Tareas" />
            <NavItem to="/checkin" label="Fichar" />
            <li className="bg-red-500 rounded-md px-4 py-2 text-white transition duration-300 hover:bg-red-700">
              <button onClick={handleClick}>Salir</button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Header;
