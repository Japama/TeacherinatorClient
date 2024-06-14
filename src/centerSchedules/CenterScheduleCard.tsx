import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Importa este paquete
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa este CSS
import { CenterScheduleHour } from './CenterScheduleHour';

interface CenterScheduleHourCardProps {
    centerScheduleHour: CenterScheduleHour;
    onEdit: (centerScheduleHour: CenterScheduleHour) => void;
    onDelete: (centerScheduleHour: CenterScheduleHour) => void;
    onViewDetails: (centerScheduleHour: CenterScheduleHour) => void;
}

function CenterScheduleHourCard(props: CenterScheduleHourCardProps) {
    const { centerScheduleHour, onEdit, onDelete, onViewDetails } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = () => {
        onEdit(centerScheduleHour);
    };

    const handleDeleteClick = () => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Seguro que quieres eliminar este departamento?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => props.onDelete(centerScheduleHour)
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

    const formatTime = (timeArray: number[]): string => {
        const [hour, minute] = timeArray;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <td onClick={handleEditClick}> {centerScheduleHour.n_hour + 1} ª</td>
            <td onClick={handleEditClick}>{formatTime(centerScheduleHour.start_time)}</td>
            <td onClick={handleEditClick}> {formatTime(centerScheduleHour.end_time)}</td>
        </>
    );
}

export default CenterScheduleHourCard;