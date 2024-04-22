// AuthContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';

// Definir las acciones relacionadas con la autenticación
type AuthAction = { type: 'LOGIN', username: string, isAdmin: boolean } | { type: 'LOGOUT' };

// Reducer para manejar el estado de autenticación
interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  isAdmin: boolean;
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
      return { ...state, isLoggedIn: true, username: action.username, isAdmin: action.isAdmin };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, username: null, isAdmin: false };
    default:
      return state;
  }
};

// Estado inicial
const initialState: AuthState = { isLoggedIn: false, username: null, isAdmin: false};

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
          const data = await response.json();
          dispatch({ type: 'LOGIN', username: formData.username, isAdmin: data.result.is_admin });
          Cookies.set('loged_in', 'true', {expires: 1 / 24});
          navigate("/checkin");
        } else {
          notify("Usuario o contraseña incorrectos");
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error('Error al iniciar sesión', error);
        dispatch({ type: 'LOGOUT' });
      }
    }
  };

  const logout = async () => {
    let logoutForm : LogoutForm = { logoff: true };
    const response = await fetch('http://127.0.0.1:8081/api/logoff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logoutForm),
    });

    if (response.ok) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const notify = (message: string) => {
    toast(message, { position: "top-center" })
}

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
