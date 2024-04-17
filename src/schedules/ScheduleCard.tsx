import { Schedule } from './Schedule';
import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Importa este paquete
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa este CSS

interface ScheduleCardProps {
    schedule: Schedule;
    onEdit: (schedule: Schedule) => void;
    onDelete: (schedule: Schedule) => void;
    onViewDetails: (schedule: Schedule) => void;
}

function ScheduleCard(props: ScheduleCardProps) {
    const { schedule, onEdit, onDelete, onViewDetails } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetailsClick = () => {
        onViewDetails(schedule);
    };

    
    const handleEditClick = () => {
        onEdit(schedule);
    };

    const handleDeleteClick = () => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Seguro que quieres eliminar este departamento?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => props.onDelete(schedule)
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
            {/* <Modal isOpen={isModalOpen} onClose={closeModal} onEdit={onEdit} schedule={schedule} /> */}
            <tr className="h-[70px] border-b bg-[#484D58] text-[#FFFFFF]">
                <td className="px-6 py-4 text-start"><input type="checkbox" id="myCheckbox" className="flex h-6 w-6  items-center rounded-full border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" /></td>
                <td className="px-6 py-4 text-start">{schedule.course}</td>
                <td className="px-6 py-4 text-start">{schedule.teacher_id}</td>
                <td className="px-6 py-4 text-start">{schedule.group_id}</td>
                <td className="px-6 py-4 text-start"><button onClick={handleViewDetailsClick} className="flex items-center rounded-full bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-blue-700">Ver</button></td>
                {/* <td className="px-6 py-4 text-start"><button onClick={() => handleDeleteClick()} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">Eliminar</button></td> */}
            </tr>
        </>
    );
}

export default ScheduleCard;