// AuthContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

// Definir las acciones relacionadas con la autenticación
type AuthAction = { type: 'LOGIN', username: string } | { type: 'LOGOUT' };

// Reducer para manejar el estado de autenticación
interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
}

interface LoginForm {
  username: string;
  pwd: string;
}

interface LogoutForm {
  logoff: boolean;
}


const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true, username: action.username };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, username: null };
    default:
      return state;
  }
};

// Estado inicial
const initialState: AuthState = { isLoggedIn: false, username: null};


// Crear el contexto de autenticación
const AuthContext = createContext<{
  state: AuthState;
  login: (formData: LoginForm) => Promise<void>;
  logout: () => void;
} | undefined>(undefined);

// Proveedor de autenticación
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const navigate = useNavigate();

  const login = async (formData: LoginForm) => {
    console.log(state.isLoggedIn)
    if(!state.isLoggedIn){
      try {
        const response = await fetch('http://127.0.0.1:8081/api/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Lógica de inicio de sesión exitoso aquí
          // Puedes actualizar el estado del usuario autenticado, por ejemplo
          dispatch({ type: 'LOGIN', username: formData.username });
          Cookies.set('loged_in', 'true', {expires: 1 / 24}); // La cookie expira en 1 hora
          navigate("/users");

        } else {
          // Lógica para manejar un inicio de sesión fallido
          console.error('Inicio de sesión fallido');
          dispatch({ type: 'LOGOUT' }); // O cualquier otra lógica que necesites
          throw new Error('Login failed');
        }
      } catch (error) {
        // Lógica para manejar errores de red u otros errores
        console.error('Error al iniciar sesión', error);
        dispatch({ type: 'LOGOUT' }); // O cualquier otra lógica que necesites
      }
    }
  };

  const logout = async () => {
    let logoutForm : LogoutForm = {
      logoff: true
    };


    const response = await fetch('http://127.0.0.1:8081/api/logoff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logoutForm),
    });

    if (response.ok) {
      // Lógica de inicio de sesión exitoso aquí
      // Puedes actualizar el estado del usuario autenticado, por ejemplo
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
