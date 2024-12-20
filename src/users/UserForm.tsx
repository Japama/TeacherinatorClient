import React, { useState } from 'react';
import { User } from './User';
import { Department } from '../departments/Department';
import { toast } from 'react-toastify';

interface UserFormProps {
    isOpen: boolean;
    isCreate: boolean;
    onClose: () => void;
    onEdit: (user: User) => void;
    onCreate: (user: User) => void;
    checkUsername: (username: string) => Promise<boolean>;
    user: User;
    departments: Department[]; // Add departments prop
}

function UserForm(props: UserFormProps) {
    const { isOpen, isCreate, onClose, onEdit, onCreate, user, checkUsername, departments } = props;
    const [editedUser, setEditedUser] = useState(user);
    const [isChangePasswordChecked, setIsChangePasswordChecked] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedUser = new User({ ...editedUser, [event.target.name]: event.target.value });
        setEditedUser(updatedUser);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedUser = new User({ ...editedUser, [event.target.name]: event.target.checked });
        setEditedUser(updatedUser);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedUser = new User({ ...editedUser, department_id: event.target.value });
        setEditedUser(updatedUser);
    };

    const handleNewUserPwdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedUser = new User({ ...editedUser, [event.target.name]: event.target.value });
        setEditedUser(updatedUser);
    };


    const notify = (message: string) => {
        toast(message, { position: "top-center" })
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (editedUser.id)
            onEdit(editedUser);
        else{
            if (await checkUsername(editedUser.username)) {
                notify("Ya existe un usuario con ese nombre.");
                return
            }
            onCreate(editedUser);
        }
        onClose();
    };


    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal " style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className=" rounded-md modal-content w-full mx-auto lg:w-[500px] drop-shadow-lg bg-white p-12" style={{ position: 'relative', margin: '0 auto', top: '50%', transform: 'translateY(-50%)' }}>
            <h1 className="backdrop-blur-sm text-4xl pb-8">  {user.id ? 'Editar usuario' : 'Crear usuario'}</h1>
                <form id="userForm" onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <label htmlFor="username" className="block">Nombre:</label>
                        <input id="username" type="text" name="username" required value={editedUser.username} onChange={handleChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>
                    <div className="relative">
                        <label htmlFor="isadmin" className="block">Administador:</label>
                        <input
                            id="isadmin"
                            type="checkbox"
                            name="isadmin"
                            checked={editedUser.isadmin}
                            onChange={handleCheckboxChange}
                            className="rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="active" className="block">Activo:</label>
                        <input
                            id="active"
                            type="checkbox"
                            name="active"
                            checked={editedUser.active}
                            onChange={handleCheckboxChange}
                            className="rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="department_id" className="block">Departamento:</label>
                        <select
                            id="department_id"
                            name="department_id"
                            value={editedUser.department_id}
                            onChange={handleSelectChange}
                            className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none"
                        >
                            {isCreate && <option value="">Seleccionar</option>}
                            {departments.map(department => (
                                <option key={department.id} value={department.id}>{department.name}</option>
                            ))}
                        </select>
                    </div>
                    {!isCreate && (
                        <div className="relative">
                            <label htmlFor="changePassword" className="block">Cambiar contraseña:</label>
                            <input
                                id="changePassword"
                                type="checkbox"
                                onChange={() => setIsChangePasswordChecked(!isChangePasswordChecked)}
                                className="rounded-md p-3 block w-full px-10 drop-shadow-lg outline-none"
                            />
                        </div>
                    )}
                    {(isCreate || isChangePasswordChecked) && (
                        <div className="relative">
                            <label htmlFor="pwd" className="block">Contraseña del nuevo usuario:</label>
                            <input
                                id="pwd"
                                type="password"
                                name="pwd"
                                onChange={handleNewUserPwdChange}
                                required
                                className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none"
                            />
                        </div>
                    )}

                    <button type="submit" form="userForm" className="rounded-md  py-2 px-5 mb-4 mt-6 shadow-lg before:block before:-left-1 before:-top-1 before:bg-black before:absolute before:h-0 before:w-0 before:hover:w-[100%] before:hover:h-[100%]  before:duration-500 before:-z-40 after:block after:-right-1 after:-bottom-1 after:bg-black after:absolute after:h-0 after:w-0 after:hover:w-[100%] after:hover:h-[100%] after:duration-500 after:-z-40 bg-white relative inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /> </svg>
                        Guardar
                    </button>
                </form>
                <button type="button" onClick={onClose} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg>
                    Cancelar
                </button>
            </div >
        </div >

    );
}

export default UserForm;
