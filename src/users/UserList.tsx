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
}

function UserList({ users, onCreate, onSave, onDelete, checkUsername, departments }: UserListProps) {
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
            <table className="min-w-full border border-gray-200 bg-white shadow-lg">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        {/* <th className="w-[50px] px-6 py-4 text-start ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th> */}
                        <th className="px-6 py-4 text-start">Nombre</th>
                        <th className="px-6 py-4 text-start">Administrador</th>
                        <th className="px-6 py-4 text-start">Docente</th>
                        <th className="px-6 py-4 text-start">Departamento</th>
                        <th className="px-6 py-4 text-start">Activo</th>
                        <th className="px-6 py-4 text-start">Editar</th>
                        <th className="px-6 py-4 text-start">Eliminar</th>
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