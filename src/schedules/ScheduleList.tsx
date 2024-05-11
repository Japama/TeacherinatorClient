import React, { useState } from 'react';
import ScheduleCard from './ScheduleCard';
import { Schedule } from './Schedule';
import ScheduleForm from './ScheduleForm';

interface ScheduleListProps {
    schedules: Schedule[];
    onCreate: (teacher: Schedule) => void;
    onSave: (schedule: Schedule) => void;
    onDelete: (schedule: Schedule) => void;
    onViewDetails: (schedule: Schedule) => void;
}

function ScheduleList({ schedules, onCreate, onSave, onDelete, onViewDetails }: ScheduleListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [scheduleBeingEdited, setScheduleBeingEdited] = useState<Schedule | null>(null);
    const [scheduleBeingCreated, setScheduleBeingCreated] = useState<Schedule | null>(null);

    const handleEdit = (schedule: Schedule) => {
        setScheduleBeingEdited(schedule);
        setisCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setScheduleBeingEdited(null);
    };

    const items = schedules.map(schedule => (
        <ScheduleCard key={schedule.id} schedule={schedule} onEdit={handleEdit} onDelete={onDelete} onViewDetails={onViewDetails} />
    ));


    const openForm = () => {
        setScheduleBeingEdited(new Schedule);
        setisCreate(true);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            {/* <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear grupo
            </button> */}
            {scheduleBeingEdited && (
                <ScheduleForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    schedule={scheduleBeingEdited}
                    schedules={schedules}
                />
            )}
            {scheduleBeingCreated && (
                <ScheduleForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    schedule={scheduleBeingCreated}
                    schedules={schedules}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        {/* <th className="w-[50px] px-6 py-4 text-start ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th> */}
                        <th className="px-6 py-4 text-start">Curso</th>
                        <th className="px-6 py-4 text-start">Docente</th>
                        <th className="px-6 py-4 text-start">Grupo</th>
                        <th className="px-6 py-4 text-start">Horario</th>
                        {/* <th className="px-6 py-4 text-start">Editar</th>
                        <th className="px-6 py-4 text-start">Eliminar</th> */}
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>

        </div>


    );

}

export default ScheduleList;