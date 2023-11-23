import React, {useState} from 'react';
import { useAuth } from '../AuthContext';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Header() {
  const { state, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logoutMethod = async (): Promise<void> => {

    try {
      const response = await logout(); // Llama a la función de inicio de sesión del contexto

      // Realiza cualquier lógica adicional después del inicio de sesión exitoso
      Cookies.set('loged_in', 'false', { expires: 1/24 }); // La cookie expira en 1
      navigate("/login");
    } catch (error) {
      // Lógica para manejar errores
    }
  };

  const handleClick = () => {
    logoutMethod();
  };

  return (
      <nav className="flex items-center justify-between flex-wrap bg-cyan-300 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          {/*<svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54"*/}
          {/*     xmlns="http://www.w3.org/2000/svg">*/}
          {/*  <path*/}
          {/*      d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>*/}
          {/*</svg>*/}
          <img
              src="/logoTeacherinator.jpeg"
              width="50"
              height="50"
              className="p-2"
              alt="Rz Codes Logo"
          />
          <span className="font-semibold text-xl tracking-tight">Teacherinator</span>
        </div>
        <div className="block lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
            </svg>
          </button>
        </div>
        <div className={`w-full ${isOpen ? 'block' : 'hidden'} lg:block flex-grow lg:flex lg:items-center lg:w-auto`}>
          <div className="text-sm lg:flex-grow">
            <a href="#responsive-header"
               className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Docs
            </a>
            <a href="#responsive-header"
               className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
              Examples
            </a>
            <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
              Blog
            </a>
          </div>
          <div>
            <a href="#"
               className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Download</a>
          </div>
        </div>
      </nav>
  )
      ;
}

export default Header;
