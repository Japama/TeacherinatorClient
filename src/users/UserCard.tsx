import { User } from './User';
import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Importa este paquete
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa este CSS
import Modal from './Modal';

interface UserCardProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

function UserCard(props: UserCardProps) {
    const { user, onEdit, onDelete } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = () => {
        onEdit(user);
    };

    const handleDeleteClick = () => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de que quieres eliminar este usuario? Si es un/a profesor/a se borrarán también sus horarios',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => props.onDelete(user)
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            {/* <Modal isOpen={isModalOpen} onClose={closeModal} onEdit={onEdit} user={user} /> */}
            <tr className="h-[70px] border-b bg-[#484D58] text-[#FFFFFF]">
                <td className="px-6 py-4 text-start">
                    <input type="checkbox" id="myCheckbox" className="flex h-6 w-6  items-center rounded-full border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                </td>
                <td className="px-6 py-4 text-start">
                    {user.username}
                </td>
                <td className="px-6 py-4 text-start ">{user.teacher == '' ? '❌' : '✔️'}</td>
                <td className="px-6 py-4 text-start "> {user.active ? '✔️' : '❌'} </td>
                <td className="px-6 py-4 text-start ">{user.department == '' ? '' : user.department}</td>
                <td className="px-6 py-4 text-start "> {user.isadmin ? '✔️' : '❌'} </td>
                <td className="px-6 py-4 text-start">
                    <button onClick={handleEditClick} className="flex items-center rounded-full bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-blue-700">
                        Editar
                    </button>
                </td>
                <td className="px-6 py-4 text-start">
                    <button onClick={() => handleDeleteClick()} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg> */}
                        Eliminar
                    </button>
                </td>
            </tr>
        </>
    );
}

export default UserCard;