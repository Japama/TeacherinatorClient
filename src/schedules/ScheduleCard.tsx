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
    const { schedule, onEdit, onViewDetails } = props;

    const handleViewDetailsClick = () => {
        onViewDetails(schedule);
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
            {/* <Modal isOpen={isModalOpen} onClose={closeModal} onEdit={onEdit} schedule={schedule} /> */}
        <tr className="h-[70px] border-b bg-gray-100 text-gray-800">
                {/* <td className="px-6 py-4 text-center"><input type="checkbox" id="myCheckbox" className="flex h-6 w-6  items-center rounded-full border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" /></td> */}
                <td className="px-6 py-4 text-center">{schedule.course}</td>
                <td className="px-6 py-4 text-center">{schedule.user?.username}</td>
                <td className="px-6 py-4 text-center"> {schedule.group?.course} {schedule.group && getStageText(schedule.group.stage)} {schedule.group?.letter}</td>
                <td className="px-6 py-4 text-center"><button onClick={handleViewDetailsClick} className="flex items-center rounded-full bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-blue-700 mx-auto">Ver</button></td>
                {/* <td className="px-6 py-4 text-center"><button onClick={() => handleDeleteClick()} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">Eliminar</button></td> */}
            </tr>
        </>
    );
}

export default ScheduleCard;