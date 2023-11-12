import React, { useState, useEffect  } from 'react';
import { useAuth} from '../AuthContext'; // Asumiendo que tienes una función `useAuth` para obtener el contexto de autenticación
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

interface SignInData {
    username: string;
    pwd: string;
}

export default function SignInSide() {
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
            Cookies.set('loged_in', 'true', { expires: 1/24 }); // La cookie expira en 1 hora
            navigate("/activities");
        } catch (error) {
            console.log("Fallo");
            // Lógica para manejar errores
        }
    }

    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        await doLogin();
    };

    useEffect(() => {
        const fetchData = async () => {
            const miCookie = Cookies.get('loged_in');
            if(miCookie === "true") {
                navigate("/activities");
            }
        };

        fetchData();
    }, []); // El array vacío [] significa que este efecto se ejecutará una vez, justo después de que el componente se monte.

    return (
        <div className="relative flex w-full pt-20 xl:pt-0  h-screen">
            <div className="w-full bg-black">
                <div className="mx-auto flex h-full w-2/3 flex-col justify-center text-white xl:w-1/2">
                    <div>
                        <p className="text-2xl">Login|</p>
                        <p>please login to continue|</p>
                    </div>
                    {/*<div className="my-6">*/}
                    {/*    <button className="flex w-full justify-center rounded-3xl border-none bg-white p-1 text-black hover:bg-gray-200 sm:p-2"><img src="https://freesvg.org/img/1534129544.png" className="mr-2 w-6 object-fill" />Sign in with Google</button>*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*    <fieldset className="border-t border-solid border-gray-600">*/}
                    {/*        <legend className="mx-auto px-2 text-center text-sm">Or login via our secure system</legend>*/}
                    {/*    </fieldset>*/}
                    {/*</div>*/}
                    <div className="mt-10">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className="mb-2.5 block font-extrabold" htmlFor="username">Username</label>
                                <input type="text" id="username" name="username" className="inline-block w-full rounded-full bg-white p-2.5 leading-none text-black placeholder-indigo-900 shadow placeholder:opacity-30" placeholder="username" onChange={handleChange}  />
                            </div>
                            {/*<div>*/}
                            {/*    <label className="mb-2.5 block font-extrabold" htmlFor="email">Email</label>*/}
                            {/*    <input type="email" id="email" className="inline-block w-full rounded-full bg-white p-2.5 leading-none text-black placeholder-indigo-900 shadow placeholder:opacity-30" placeholder="mail@user.com" />*/}
                            {/*</div>*/}
                            <div className="mt-4">
                                <label className="mb-2.5 block font-extrabold" htmlFor="pwd">Password</label>
                                <input type="password" id="pwd" name="pwd"  className="inline-block w-full rounded-full bg-white p-2.5 leading-none text-black placeholder-indigo-900 shadow" onChange={handleChange}  />
                            </div>
                            <div className="mt-4 flex w-full flex-col justify-between sm:flex-row">
                                <div><input type="checkbox" id="remember" /><label htmlFor="remember" className="mx-2 text-sm">Remember me</label></div>
                                <div>
                                    <a href="#" className="text-sm hover:text-gray-200">Forgot password</a>
                                </div>
                            </div>
                            <div className="my-10">
                                <button className="w-full rounded-full bg-orange-600 p-5 hover:bg-orange-800">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/*<div className="h-screen w-1/2 bg-blue-600 hidden xl:flex">*/}
            {/*    <img src="https://images.pexels.com/photos/2523959/pexels-photo-2523959.jpeg" className="h-full w-full" />*/}
            {/*</div>*/}
        </div>
        // <div className="flex items-center justify-center bg-gray-50 min-h-screen">
        //     <div className="max-w-md w-full space-y-8 p-4">
        //         <div className="text-center">
        //             <h1 className="text-3xl font-extrabold text-gray-900">Sign in</h1>
        //         </div>
        //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        //             <input type="hidden" name="remember" defaultValue="true" />
        //             <div className="rounded-md shadow-sm -space-y-px">
        //                 <div>
        //                     <input
        //                         id="username"
        //                         name="username"
        //                         type="username"
        //                         required
        //                         className="appearance-none rounded-none relative block w-full px-3 py-2 border 
        //           border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none 
        //           focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        //                         placeholder="User"
        //                         onChange={handleChange} 
        //                     />
        //                 </div>
        //                 <div>
        //                     <input
        //                         id="pwd"
        //                         name="pwd"
        //                         type="password"
        //                         required
        //                         className="appearance-none rounded-none relative block w-full px-3 py-2 border 
        //           border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none 
        //           focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        //                         placeholder="Password"
        //                         onChange={handleChange} 
        //                     />
        //                 </div>
        //             </div>
        //
        //             <div className="flex items-center justify-between">
        //                 <div className="flex items-center">
        //                     <input
        //                         id="remember-me"
        //                         name="remember-me"
        //                         type="checkbox"
        //                         className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        //                     />
        //                     <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
        //                         Remember me
        //                     </label>
        //                 </div>
        //
        //                 <div className="text-sm">
        //                     <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
        //                         Forgot your password?
        //                     </a>
        //                 </div>
        //             </div>
        //
        //             <div>
        //                 <button
        //                     type="submit"
        //                     className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm 
        //         font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
        //         focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        //                 >
        //                     Sign in
        //                 </button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
    );
}
