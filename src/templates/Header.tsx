// Header.tsx
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Cookies from "js-cookie";
import { useRef } from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import NavItem from './NavItem';
import DropNavItem from './DropNavItem';

function Header() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [dropDownState, setDropDownState] = useState(false);
  const dropDownMenuRef = useRef<HTMLDivElement>(null);

  const logoutMethod = async (): Promise<void> => {

    try {
      const response = await logout(); // Llama a la función de inicio de sesión del contexto

      // Realiza cualquier lógica adicional después del inicio de sesión exitoso
      Cookies.set('loged_in', 'false', { expires: 1 / 24 }); // La cookie expira en 1
      navigate("/login");
    } catch (error) {
      // Lógica para manejar errores
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

    return () => {
      document.removeEventListener('mousedown', closeDropDown);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-gray-800 dark:bg-[#393E46] text-white dark:text-white fixed top-0 w-screen">
      <div className="scale-100 cursor-pointer text-xl font-semibold text-white dark:text-white transition-all duration-200 hover:scale-110">
        <h2>Teacherinator</h2>
      </div>

      <ul className="hidden items-center justify-between gap-10 md:flex">
        <NavItem to="/index" label="Indice" />
        {state.isAdmin && <NavItem to="/users" label="Usuarios" />}
        {/* {state.isAdmin && <NavItem to="/teachers" label="Docentes" />} */}
        {state.isAdmin && <NavItem to="/departments" label="Departamentos" />}
        {state.isAdmin && <NavItem to="/groups" label="Grupos" />}
        {state.isAdmin && <NavItem to="/schedules" label="Horarios" />}
        <NavItem to="/current" label="Tareas" />
        <NavItem to="/checkin" label="Fichar" />
        <li className="group flex  cursor-pointer flex-col bg-rose-700 rounded-md px-4 py-2">
          <button onClick={handleClick}> Salir </button><span className="mt-[2px] h-[3px]  w-[0px] rounded-full  transition-all duration-300 group-hover:w-full"></span>
        </li>
      </ul>
      <div ref={dropDownMenuRef} onClick={() => setDropDownState(!dropDownState)} className="relative flex transition-transform md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer" > <line x1="4" x2="20" y1="12" y2="12" /> <line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /> </svg>
        {dropDownState && (
          <ul className=" z-10  gap-2  bg-gray-200 dark:bg-[#393E46]  absolute right-0 top-11 flex w-[200px] flex-col  rounded-lg   text-base ">
            <DropNavItem to="/index" children="Indice" />
            {state.isAdmin && <DropNavItem to="/users" children="Usuarios" />}
            {/* {state.isAdmin && <DropNavItem to="/teachers" children="Docentes" />} */}
            {state.isAdmin && <DropNavItem to="/departments" children="Departamentos" />}
            {state.isAdmin && <DropNavItem to="/schedules" children="Horarios" />}
            <DropNavItem to="/current" children="Tareas" />
            <DropNavItem to="/checkin" children="Fichar" />
            <li className="cursor-pointer  px-6 py-2 text-black dark:text-white hover:bg-sky-600 bg-red-500  rounded-lg">
              <button onClick={handleClick}> Salir </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Header;
