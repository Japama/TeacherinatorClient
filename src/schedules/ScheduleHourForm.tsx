import React, { useState } from 'react';
import { ScheduleHour } from './ScheduleHour';
import { confirmAlert } from 'react-confirm-alert';

interface ScheduleHourFormProps {
    isOpen: boolean;
    isCreate: boolean;
    onCloseEdit: () => void;
    onEdit: (schedule: ScheduleHour) => void;
    onDelete: (schedule: ScheduleHour) => void;
    scheduleHour: ScheduleHour;
}

function ScheduleHourForm(props: ScheduleHourFormProps) {
    const { isOpen, isCreate, onCloseEdit, onEdit, onDelete, scheduleHour } = props;
    const [editedScheduleHour, setEditedScheduleHour] = useState(scheduleHour);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedScheduleHour = new ScheduleHour({ ...editedScheduleHour, [event.target.name]: event.target.value });
        setEditedScheduleHour(updatedScheduleHour);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onEdit(editedScheduleHour);
        onCloseEdit();
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedScheduleHour = new ScheduleHour({ ...editedScheduleHour, [event.target.name]: event.target.value });
        setEditedScheduleHour(updatedScheduleHour);
    };


    const handleDeleteClick = () => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de que quieres eliminar esta hora?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        onDelete(editedScheduleHour);
                        onCloseEdit();
                    }

                },
                {
                    label: 'No',
                }
            ]
        });
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal " style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className=" rounded-md modal-content w-full mx-auto lg:w-[500px] drop-shadow-lg bg-white p-12" style={{ position: 'relative', margin: '0 auto', top: '50%', transform: 'translateY(-50%)' }}>
                <h1 className="backdrop-blur-sm text-4xl pb-8">  {editedScheduleHour.id ? 'Editar hora' : 'Crear hora'}</h1>
                <form id="scheduleForm" onSubmit={handleSubmit} className="space-y-5">
                    {/* <div className="relative">
                        <label htmlFor="schedule_id" className="block">Horario</label>
                        <input id="schedule_id" type="number" name="schedule_id" required value={editedScheduleHour.schedule_id} onChange={handleChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div> */}

                    <input id="schedule_id" type="hidden" name="schedule_id" required value={editedScheduleHour.schedule_id} onChange={handleChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    <div className="relative">
                        <label htmlFor="subject_name" className="block">Asignatura</label>
                        <input id="subject_name" type="text" name="subject_name" required value={editedScheduleHour.subject_name} onChange={handleChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>

                    <div className="relative">
                        <label htmlFor="classroom_name" className="block">Clase</label>
                        <input id="classroom_name" type="text" name="classroom_name" required value={editedScheduleHour.classroom_name} onChange={handleChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>
                    <div className="relative">
                        <label htmlFor="week_day" className="block">Día de la semana</label>
                        <select id="week_day" name="week_day" value={editedScheduleHour.week_day} required onChange={handleSelectChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" disabled={!isCreate}>
                            <option value="0">Lunes</option>
                            <option value="1">Martes</option>
                            <option value="2">Miércoles</option>
                            <option value="3">Jueves</option>
                            <option value="4">Viernes</option>
                        </select>
                    </div>
                    <div className="relative">
                        <label htmlFor="n_hour" className="block">Nº clase</label>
                        <input id="n_hour" type="text" name="n_hour" required value={(editedScheduleHour.n_hour + 1) + "ª"} onChange={handleChange} readOnly={true} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>
                    {/* 
                    <div className="relative">
                        <label htmlFor="name" className="block">Nombre</label>
                        <input id="name" type="text" name="name" required value={editedScheduleHour.course} onChange={handleChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div> */}
                    <button type="submit" form="scheduleForm" className="rounded-md  py-2 px-5 mb-4 mt-6 shadow-lg before:block before:-left-1 before:-top-1 before:bg-black before:absolute before:h-0 before:w-0 before:hover:w-[100%] before:hover:h-[100%]  before:duration-500 before:-z-40 after:block after:-right-1 after:-bottom-1 after:bg-black after:absolute after:h-0 after:w-0 after:hover:w-[100%] after:hover:h-[100%] after:duration-500 after:-z-40 bg-white relative inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /> </svg>
                        Guardar
                    </button>
                </form>
                <div className="relative flex items-center mt-4">
                    <button type="button" onClick={onCloseEdit} className="flex items-center  rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg>
                        Cancelar
                    </button>
                    {editedScheduleHour.id && (
                        <button type="button" onClick={handleDeleteClick} className="flex items-center rounded-full bg-black px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-gray-700 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg>
                            Eliminar
                        </button>)}
                </div>
            </div >
        </div >
    );
}

export default ScheduleHourForm;
