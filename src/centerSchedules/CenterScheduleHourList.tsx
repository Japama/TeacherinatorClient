import React, { useState } from 'react';
import ScheduleCard from './CenterScheduleCard';
import ScheduleForm from './CenterScheduleForm';
import { CenterScheduleHour } from './CenterScheduleHour';

interface CenterScheduleHourListProps {
    centerScheduleHours: CenterScheduleHour[];
    maxHour: number;
    onCreate: (centerScheduleHour: CenterScheduleHour) => void;
    onSave: (centerScheduleHour: CenterScheduleHour) => void;
    onDelete: (centerScheduleHour: CenterScheduleHour) => void;
    onViewDetails: (centerScheduleHour: CenterScheduleHour) => void;
}

function CenterScheduleHourList({ centerScheduleHours, maxHour, onCreate, onSave, onDelete, onViewDetails }: CenterScheduleHourListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [scheduleBeingEdited, setScheduleBeingEdited] = useState<CenterScheduleHour | null>(null);


    const handleEdit = (schedule: CenterScheduleHour) => {
        setScheduleBeingEdited(schedule);
        setisCreate(false);
        setIsModalOpen(true);
    };

    const handleCreate = (schedule: CenterScheduleHour) => {
        setScheduleBeingEdited(schedule);
        setisCreate(true);
        setIsModalOpen(true);
    };

    const handleClick = (hour: number) => {
        const schedule = new CenterScheduleHour({ ...scheduleBeingEdited, n_hour: hour });
        handleCreate(schedule);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setScheduleBeingEdited(null);
    };

    const scheduleByHour = centerScheduleHours.reduce((acc, schedule) => {
        if (!acc[schedule.n_hour]) {
            acc[schedule.n_hour] = [];
        }
        acc[schedule.n_hour].push(schedule);
        return acc;
    }, {} as { [key: number]: CenterScheduleHour[] });

    const openForm = () => {
        setIsModalOpen(true);
    };

    const hours = Array.from({ length: maxHour }, (_, i) => i); // Asume que n_hour es un número de 0 a 23

    return (
        <div className="overflow-x-auto">
            {scheduleBeingEdited && (
                <ScheduleForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    onDelete={onDelete}
                    schedule={scheduleBeingEdited}
                    schedules={centerScheduleHours}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg text-center">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="px-6 py-4 text-center">Nº de hora</th>
                        <th className="px-6 py-4 text-center">Hora inicio</th>
                        <th className="px-6 py-4 text-center">Hora fin</th>
                    </tr>
                </thead>
                <tbody>
                    {centerScheduleHours.map(hour => (
                        <tr key={hour.id} className="h-[70px] border-b bg-gray-700 text-[#FFFFFF] hover:bg-slate-500">
                            <ScheduleCard centerScheduleHour={hour} onEdit={handleEdit} onDelete={onDelete} onViewDetails={onViewDetails} />
                        </tr>
                    ))}
                    < tr className="h-[70px] border-b bg-gray-700 text-[#FFFFFF]"  onClick={() => handleClick(maxHour)}  >
                        <td colSpan={3} className="px-6 py-4 text-center">➕</td>
                    </tr>
                </tbody>
            </table>
        </div >
    );
}

export default CenterScheduleHourList;
