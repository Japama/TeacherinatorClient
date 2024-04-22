import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // Asumiendo que tienes una función `useAuth` para obtener el contexto de autenticación
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

interface SignInData {
    username: string;
    pwd: string;
}

export default function SignInSide() {
    const { state } = useAuth();
    // const authState = useAuth().state;
    const { login } = useAuth(); // Obtén la función de inicio de sesión del contexto de autenticación
    const [formData, setFormData] = useState<SignInData>({
        username: '',
        pwd: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const navigate = useNavigate();

    async function doLogin() {
        try {
            const response = await login(formData); // Llama a la función de inicio de sesión del contexto
            // Realiza cualquier lógica adicional después del inicio de sesión exitoso
        } catch (error) {
            notify("Fallo");
            // Lógica para manejar errores
        }
    }

    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        await doLogin();
    };

    useEffect(() => {
        if(state.isLoggedIn){
            navigate("/index");
        }
    }, []); // El array vacío [] significa que este efecto se ejecutará una vez, justo después de que el componente se monte.

    const notify = (message: string) => {
        toast(message, { position: "top-center" })
    }

    return (
        <div className="relative flex w-full h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <ToastContainer />
            <div className="m-auto flex h-full w-4/5 md:w-1/2 lg:w-1/3 flex-col justify-center text-white rounded-lg shadow-lg bg-gray-800 p-10">
                <div className="mb-10">
                    <p className="text-4xl font-bold mb-2">Login</p>
                    <p className="text-lg">Please login to continue</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="mb-2 block text-lg font-bold" htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" className="w-full px-3 py-2 rounded-lg bg-gray-200 text-black placeholder-gray-500" placeholder="Username" onChange={handleChange} />
                    </div>
                    <div className="mb-6">
                        <label className="mb-2 block text-lg font-bold" htmlFor="pwd">Password</label>
                        <input type="password" id="pwd" name="pwd" className="w-full px-3 py-2 rounded-lg bg-gray-200 text-black placeholder-gray-500" placeholder="Password" onChange={handleChange} />
                    </div>
                    <div className="mb-6 flex justify-between items-center">
                        <div className="flex items-center">
                            <input type="checkbox" id="remember" className="mr-2" />
                            <label htmlFor="remember" className="text-sm">Remember me</label>
                        </div>
                        <div>
                            <a href="#" className="text-sm text-blue-300 hover:text-blue-500">Forgot password?</a>
                        </div>
                    </div>
                    <div className="mb-6">
                        <input type='submit' value='Login' className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700" />
                    </div>
                </form>

            </div>
        </div>

    );
}
