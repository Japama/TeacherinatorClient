import { User } from './User';
import UserCard from './UserCard';
import React, { useState } from 'react';

interface UserListProps {
    users: User[];
    onSave: (user: User) => void;
}

function UserList({ users, onSave }: UserListProps) {
    const [userBeingEdited, setUserBeingEdited] = useState({});
    const handleEdit = (user: User) => {
        setUserBeingEdited(user);
    }
    const cancelEditing = () => {
        setUserBeingEdited({});
    };
    const items = users.map(user => (
            user === userBeingEdited ? (
                <div  key={user.id} ></div>
                // <UserForm
                //     user={user}
                //     onSave={onSave}
                //     onCancel={cancelEditing}
                // />
            ) : (
                <UserCard  key={user.id} user={user} onEdit={handleEdit}  />
            )
    ));
    return (

        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white shadow-lg">
                {/* Table Header */}
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="w-[50px] px-6 py-4 text-start ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th>
                        <th className="px-6 py-4 text-start">Nombre</th>
                        <th className="px-6 py-4 text-start">Es administrador</th>
                        <th className="px-6 py-4 text-start">Profesor</th>
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