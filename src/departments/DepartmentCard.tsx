import { Department } from './Department';
import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Importa este paquete
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa este CSS
// import Modal from './Modal';

interface DepartmentCardProps {
    department: Department;
    onEdit: (department: Department) => void;
    onDelete: (department: Department) => void;
}

function DepartmentCard(props: DepartmentCardProps) {
    const { department, onEdit } = props;
    const [setIsModalOpen] = useState(false);

    const handleEditClick = () => {
        onEdit(department);
    };

    const handleDeleteClick = () => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Seguro que quieres eliminar este departamento?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => props.onDelete(department)
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    return (
        <>
            {/* <Modal isOpen={isModalOpen} onClose={closeModal} onEdit={onEdit} department={department} /> */}
        <tr className="h-[70px] border-b bg-gray-100 text-gray-800">
                {/* <td className="px-6 py-4 text-center">
                    <input type="checkbox" id="myCheckbox" className="flex h-6 w-6  items-center rounded-full border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                </td> */}
                <td className="px-6 py-4 text-center">
                    {department.name}
                </td>
                <td className="px-6 py-4 text-center">
                    <button onClick={handleEditClick} className="flex items-center rounded-full bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-blue-700 mx-auto">
                        Editar
                    </button>
                </td>
                <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDeleteClick()} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700 mx-auto">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg> */}
                        Eliminar
                    </button>
                </td>
            </tr>
        </>
    );
}

export default DepartmentCard;