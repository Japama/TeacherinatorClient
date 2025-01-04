// src/services/apiService.ts

import Cookies from 'js-cookie';

const baseUrl = `${process.env.REACT_APP_API_BASE_URL}rpc`;
const loginUrl = `${process.env.REACT_APP_API_BASE_URL}login`;
const logoutUrl = `${process.env.REACT_APP_API_BASE_URL}logoff`;

// Función genérica para llamadas RPC
export const apiService = async (method: string, params: object, navigate: Function, authState: any) => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        method,
        params,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error.message === 'NO_AUTH') {
        authState.isLoggedIn = false;
        navigate('/login');
      } else {
        throw new Error(data.error.message);
      }
    }

    return data.result;
  } catch (error) {
    console.error(`Error in API call (${method}):`, error);
    throw error;
  }
};

// Función para login
export const loginService = async (formData: { username: string; pwd: string }) => {
  const response = await fetch(loginUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    const data = await response.json();
    Cookies.set('loged_in', 'true', { expires: 1 / 24 }); // Configura la cookie de sesión
    return data.result;
  } else {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Login failed');
  }
};

// Función para logout
export const logoutService = async () => {
  const response = await fetch(logoutUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ logoff: true }),
  });

  if (response.ok) {
    Cookies.remove('loged_in'); // Elimina la cookie de sesión
  } else {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Logout failed');
  }
};
