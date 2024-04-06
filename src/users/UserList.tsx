import React, { useState } from 'react';
import { User } from './User';
import UserCard from './UserCard';
import Modal from './Modal'; // Asegúrate de tener un componente Modal
import { Department } from '../departments/Department';

interface UserListProps {
    users: User[];
    onSave: (user: User) => void;
    onDelete: (user: User) => void;
    departments: Department[];
}

function UserList({ users, onSave, onDelete, departments }: UserListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userBeingEdited, setUserBeingEdited] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setUserBeingEdited(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserBeingEdited(null);
    };

    const items = users.map(user => (
        <UserCard key={user.id} user={user} onEdit={handleEdit} onDelete={onDelete} />
    ));

    return (
        <div className="overflow-x-auto">
            {userBeingEdited && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onEdit={onSave}
                    user={userBeingEdited}
                    departments={departments}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg">
                {/* Table Header */}
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="w-[50px] px-6 py-4 text-start ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th>
                        <th className="px-6 py-4 text-start">Nombre</th>
                        <th className="px-6 py-4 text-start">Profesor</th>
                        <th className="px-6 py-4 text-start">Activo</th>
                        <th className="px-6 py-4 text-start">Departamento</th>
                        <th className="px-6 py-4 text-start">Es administrador</th>
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