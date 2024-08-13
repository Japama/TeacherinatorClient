import React, { useState } from 'react';
import { User } from './User';
import UserCard from './UserCard';
import UserForm from './UserForm';
import { Department } from '../departments/Department';

interface UserListProps {
    users: User[];
    onCreate: (teacher: User, changePassword: boolean) => void;
    onSave: (user: User, changePassword: boolean) => void;
    onDelete: (user: User) => void;
    checkUsername: (username: string) => Promise<boolean>;
    departments: Department[];
    filters: {
        username: string;
        is_admin: string;
        department: string;
        active: string;
    };
    onFilterChange: (field: string, value: string) => void;
}

function UserList({ users, onCreate, onSave, onDelete, checkUsername, departments, filters, onFilterChange }: UserListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [userBeingEdited, setUserBeingEdited] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setUserBeingEdited(user);
        setisCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserBeingEdited(null);
    };

    const items = users.map(user => (
        <UserCard key={user.id} user={user} onEdit={handleEdit} onDelete={onDelete} />
    ));


    const openForm = () => {
        setUserBeingEdited(new User());
        setisCreate(true);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear Usuario
            </button>
            {userBeingEdited && (
                <UserForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    user={userBeingEdited}
                    checkUsername={checkUsername}
                    departments={departments}
                />
            )}
            {!userBeingEdited && (
                <UserForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    user={new User()}
                    checkUsername={checkUsername}
                    departments={departments}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg text-center">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        {/* <th className="w-[50px] px-6 py-4 text-center ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th> */}
                        <th className="px-6 py-4 text-center">Nombre</th>
                        <th className="px-6 py-4 text-center">Administrador</th>
                        <th className="px-6 py-4 text-center">Docente</th>
                        <th className="px-6 py-4 text-center">Departamento</th>
                        <th className="px-6 py-4 text-center">Activo</th>
                        <th className="px-6 py-4 text-center">Editar</th>
                        <th className="px-6 py-4 text-center">Eliminar</th>
                    </tr>
                    <tr className="h-[70px] border-b bg-[#596B99] text-[#000000]">
                        <td className="px-6 py-4 text-center">                <input
                            type="text"
                            placeholder="Buscar por nombre"
                            value={filters.username}
                            onChange={(e) => onFilterChange('username', e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        /></td>
                        <td className="px-6 py-4 text-center">Administrador</td>
                        <td className="px-6 py-4 text-center">Docente</td>
                        <td className="px-6 py-4 text-center">Departamento</td>
                        <td className="px-6 py-4 text-center">Activo</td>
                        <td colSpan={2} className="px-6 py-4 text-center"> Filtrado</td>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>

        </div>


    );

}

export default UserList;