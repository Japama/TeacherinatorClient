import { Teacher } from './Teacher';
import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Importa este paquete
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa este CSS

interface TeacherCardProps {
    teacher: Teacher;
    onEdit: (teacher: Teacher) => void;
    onDelete: (teacher: Teacher) => void;
}

function TeacherCard(props: TeacherCardProps) {
    const { teacher, onEdit, onDelete } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = () => {
        onEdit(teacher);
    };

    const handleDeleteClick = () => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Seguro que quieres eliminar este docente?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => props.onDelete(teacher)
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
            {/* <Modal isOpen={isModalOpen} onClose={closeModal} onEdit={onEdit} teacher={teacher} /> */}
            <tr className="h-[70px] border-b bg-gray-700 text-[#FFFFFF]">
                <td className="px-6 py-4 text-center">
                    <input type="checkbox" id="myCheckbox" className="flex h-6 w-6  items-center rounded-full border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                </td>
                <td className="px-6 py-4 text-center">
                    {teacher.user?.username}
                </td>
                <td className="px-6 py-4 text-center">
                    {teacher.department?.name}
                </td>
                <td className="px-6 py-4 text-center "> {teacher.active ? '✔️' : '❌'} </td>
                <td className="px-6 py-4 text-center">
                    <button onClick={handleEditClick} className="flex items-center rounded-full bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-blue-700">
                        Editar
                    </button>
                </td>
                <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDeleteClick()} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg> */}
                        Eliminar
                    </button>
                </td>
            </tr>
        </>
    );
}

export default TeacherCard;