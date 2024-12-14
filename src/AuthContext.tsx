// AuthContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginService, logoutService } from '../src/services/apiServices';

// Definir las acciones relacionadas con la autenticación
type AuthAction = { type: 'LOGIN', username: string, isAdmin: boolean } | { type: 'LOGOUT' };

// Reducer para manejar el estado de autenticación
interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  isAdmin: boolean;
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
const initialState: AuthState = { isLoggedIn: false, username: null, isAdmin: false };

// Crear el contexto de autenticación
const AuthContext = createContext<{
  state: AuthState;
  login: (formData: { username: string; pwd: string }) => Promise<void>;
  logout: () => Promise<void>;
} | undefined>(undefined);

// Proveedor de autenticación
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  const login = async (formData: { username: string; pwd: string }) => {
    try {
      const result = await loginService(formData);
      dispatch({ type: 'LOGIN', username: formData.username, isAdmin: result.is_admin });
      toast('Inicio de sesión exitoso', { position: 'top-center' });
      navigate('/checkin');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      toast('Usuario o contraseña incorrectos', { position: 'top-center' });
      dispatch({ type: 'LOGOUT' });
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      dispatch({ type: 'LOGOUT' });
      toast('Cierre de sesión exitoso', { position: 'top-center' });
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
      toast('Error al cerrar sesión', { position: 'top-center' });
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
