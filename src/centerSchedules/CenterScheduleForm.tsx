import React, { useState } from 'react';
import { CenterScheduleHour } from './CenterScheduleHour';
import { confirmAlert } from 'react-confirm-alert';

interface CenterScheduleHourFormProps {
    isOpen: boolean;
    isCreate: boolean;
    onClose: () => void;
    onEdit: (schedule: CenterScheduleHour) => void;
    onCreate: (schedule: CenterScheduleHour) => void;
    onDelete: (schedule: CenterScheduleHour) => void;
    schedule: CenterScheduleHour;
    schedules: CenterScheduleHour[];
}

function CenterScheduleHourForm(props: CenterScheduleHourFormProps) {
    const { isOpen, isCreate, onClose, onEdit, onCreate, onDelete, schedule } = props;
    const [editedCenterScheduleHour, setEditedCenterScheduleHour] = useState(schedule);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        if (event.target.name === "n_hour") {
            const valueNumer = Number(value) - 1;
            const updatedCenterScheduleHour = new CenterScheduleHour({ ...editedCenterScheduleHour, [event.target.name]: valueNumer });
            setEditedCenterScheduleHour(updatedCenterScheduleHour);
        } else {
            const updatedCenterScheduleHour = new CenterScheduleHour({ ...editedCenterScheduleHour, [event.target.name]: value });
            setEditedCenterScheduleHour(updatedCenterScheduleHour);
        }
    };

    const handleChangeHour = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseTime(event.target.value);
        const updatedCenterScheduleHour = new CenterScheduleHour({ ...editedCenterScheduleHour, [event.target.name]: value });
        setEditedCenterScheduleHour(updatedCenterScheduleHour);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(event.target.value);
        const updatedCenterScheduleHour = new CenterScheduleHour({ ...editedCenterScheduleHour, [event.target.name]: value });
        setEditedCenterScheduleHour(updatedCenterScheduleHour);
    };

    const handleDeleteClick = () => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de que quieres eliminar esta hroa?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        onDelete(editedCenterScheduleHour);
                        onClose();
                    }

                },
                {
                    label: 'No',
                }
            ]
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editedCenterScheduleHour.id)
            onEdit(editedCenterScheduleHour);
        else
            onCreate(editedCenterScheduleHour);
        onClose();

    };


    if (!isOpen) {
        return null;
    }

    const formatTime = (timeArray: number[]): string => {
        const [hour, minute] = timeArray;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    const parseTime = (timeString: string): number[] => {
        const [hour, minute] = timeString.split(':').map(Number);
        return [hour, minute, 0, 0];
    };


    return (
        <div className="modal " style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className=" rounded-md modal-content w-full mx-auto lg:w-[500px] drop-shadow-lg bg-white p-12" style={{ position: 'relative', margin: '0 auto', top: '50%', transform: 'translateY(-50%)' }}>
                <h1 className="backdrop-blur-sm text-4xl pb-8">  {schedule.id ? 'Editar hora' : 'Crear hora'}</h1>
                <form id="scheduleForm" onSubmit={handleSubmit} className="space-y-5">
                    {/* <div className="relative">
                        <label htmlFor="week_day" className="block">Día de la semana:</label>
                        <select id="week_day" name="week_day" value={editedCenterScheduleHour.week_day} required onChange={handleSelectChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" disabled={!isCreate}>
                            <option value="0">Lunes</option>
                            <option value="1">Martes</option>
                            <option value="2">Miércoles</option>
                            <option value="3">Jueves</option>
                            <option value="4">Viernes</option>
                        </select>
                    </div> */}
                    <div className="relative">
                        <label htmlFor="n_hour" className="block">Nº de hora:</label>
                        <input id="n_hour" type="number" name="n_hour" required value={editedCenterScheduleHour.n_hour + 1} onChange={handleChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" readOnly={!isCreate} />
                    </div>
                    <div className="relative">
                        <label htmlFor="start_time" className="block">Hora de inicio:</label>
                        <input id="start_time" type="time" name="start_time" required value={formatTime(editedCenterScheduleHour.start_time)} onChange={handleChangeHour} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>
                    <div className="relative">
                        <label htmlFor="end_time" className="block">Hora de final:</label>
                        <input id="end_time" type="time" name="end_time" required value={formatTime(editedCenterScheduleHour.end_time)} onChange={handleChangeHour} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>

                    <button type="submit" form="scheduleForm" className="rounded-md  py-2 px-5 mb-4 mt-6 shadow-lg before:block before:-left-1 before:-top-1 before:bg-black before:absolute before:h-0 before:w-0 before:hover:w-[100%] before:hover:h-[100%]  before:duration-500 before:-z-40 after:block after:-right-1 after:-bottom-1 after:bg-black after:absolute after:h-0 after:w-0 after:hover:w-[100%] after:hover:h-[100%] after:duration-500 after:-z-40 bg-white relative inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /> </svg>
                        Guardar
                    </button>
                </form>
                <div className="relative flex items-center mt-4">
                    <button type="button" onClick={onClose} className="flex items-center  rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg>
                        Cancelar
                    </button>
                    {editedCenterScheduleHour.id && (
                        <button type="button" onClick={handleDeleteClick} className="flex items-center rounded-full bg-black px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-gray-700 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg>
                            Eliminar
                        </button>)}
                </div>
            </div >
        </div >

    );
}

export default CenterScheduleHourForm;
