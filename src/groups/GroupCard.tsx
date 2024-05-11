import { Group } from './Group';
import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Importa este paquete
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa este CSS
// import Modal from './Modal';

interface GroupCardProps {
    group: Group;
    onEdit: (group: Group) => void;
    onDelete: (group: Group) => void;
}

function GroupCard(props: GroupCardProps) {
    const { group, onEdit, onDelete } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = () => {
        onEdit(group);
    };

    const handleDeleteClick = () => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Seguro que quieres eliminar este grupo?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => props.onDelete(group)
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

    function getStageText(stage: number): string {
        switch (stage) {
            case 1:
                return 'ESO';
            case 2:
                return 'Bachiller';
            case 3:
                return 'DAM';
            // Agrega más casos según sea necesario
            default:
                return '';
        }
    }

    return (
        <>
            {/* <Modal isOpen={isModalOpen} onClose={closeModal} onEdit={onEdit} group={group} /> */}
            <tr className="h-[70px] border-b bg-gray-700 text-[#FFFFFF]">
                {/* <td className="px-6 py-4 text-start"><input type="checkbox" id="myCheckbox" className="flex h-6 w-6  items-center rounded-full border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" /></td> */}
                <td className="px-6 py-4 text-start">{group.year}</td>
                <td className="px-6 py-4 text-start">{group.course}º {getStageText(group.stage)} {group.letter}</td>
                <td className="px-6 py-4 text-start">{group.tutor_name}</td>
                <td className="px-6 py-4 text-start"><button onClick={handleEditClick} className="flex items-center rounded-full bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-blue-700">Editar</button></td>
                <td className="px-6 py-4 text-start"><button onClick={() => handleDeleteClick()} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">Eliminar</button></td>
            </tr>
        </>
    );
}

export default GroupCard;