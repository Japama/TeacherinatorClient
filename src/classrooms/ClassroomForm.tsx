import React, { useState } from 'react';
import { Classroom } from './Classroom';
import { ClassroomType } from '../classrooms_types/ClassroomType';
import { Building } from '../buildings/Building';

interface ClassroomFormProps {
    isOpen: boolean;
    isCreate: boolean;
    onClose: () => void;
    onEdit: (classroom: Classroom) => void;
    onCreate: (classroom: Classroom) => void;
    classroom: Classroom;
    classrooms: Classroom[];
    classroomTypes: ClassroomType[];
    buildings: Building[];
}

function ClassroomForm(props: ClassroomFormProps) {
    const { isOpen, isCreate, onClose, onEdit, onCreate, classroom, buildings, classroomTypes } = props;
    const [editedClassroom, setEditedClassroom] = useState(classroom);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const updatedClassroom = new Classroom({
            ...editedClassroom,
            [name]: name === 'floor' || name === 'number' ? Number(value) : value,
        });
        setEditedClassroom(updatedClassroom);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(event.target.value);
        const updatedClassroom = new Classroom({ ...editedClassroom, [event.target.name]: value });
        setEditedClassroom(updatedClassroom);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editedClassroom.id) {
            onEdit(editedClassroom);
        } else {
            onCreate(editedClassroom);
        }
        onClose();
    };
    

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="rounded-md modal-content w-full mx-auto lg:w-[500px] drop-shadow-lg bg-white p-12" style={{ position: 'relative', margin: '0 auto', top: '50%', transform: 'translateY(-50%)' }}>
                <h1 className="backdrop-blur-sm text-4xl pb-8">{classroom.id ? 'Editar aula' : 'Crear aula'}</h1>
                <form id="classroomForm" onSubmit={handleSubmit} className="space-y-5">
                    <label htmlFor="building" className="block">Edificio</label>
                    <select id="building" name="building" value={editedClassroom.building} required onChange={handleSelectChange} className="text-center rounded-md p-3 block w-full px-10 drop-shadow-lg outline-none">
                        {isCreate ? (<option value="">Seleccionar</option>) : (<></>)}
                        {buildings.map(build => <option key={build.id} value={build.id}>{build.building_name}</option>)}
                    </select>
                    <div className="relative">
                        <label htmlFor="floor" className="block">Piso</label>
                        <input id="floor" type="number" min="0" name="floor" required value={editedClassroom.floor} onChange={handleChange} className="text-center rounded-md p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>
                    <div className="relative">
                        <label htmlFor="number" className="block">Número</label>
                        <input id="number" type="number" min="0" name="number" required value={editedClassroom.number} onChange={handleChange} className="text-center rounded-md p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>
                    <div className="relative">
                        <label htmlFor="name" className="block">Nombre</label>
                        <input id="name" type="text" name="name" required value={editedClassroom.name} onChange={handleChange} className="text-center rounded-md p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>
                    <div className="relative">
                        <label htmlFor="type_c" className="block">Tipo de aula</label>
                        <select id="type_c" name="type_c" value={editedClassroom.type_c} required onChange={handleSelectChange} className="text-center rounded-md p-3 block w-full px-10 drop-shadow-lg outline-none">
                            {isCreate ? (<option value="">Seleccionar</option>) : (<></>)}
                            {classroomTypes.map(type => <option key={type.id} value={type.id}>{type.type_name}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <label htmlFor="description" className="block">Descripción</label>
                        <input type="text" id="description" name="description" value={editedClassroom.description} onChange={handleChange} className="text-center rounded-md p-3 block w-full px-10 drop-shadow-lg outline-none"></input>
                    </div>
                    <button type="submit" form="classroomForm" className="rounded-md py-2 px-5 mb-4 mt-6 shadow-lg before:block before:-left-1 before:-top-1 before:bg-black before:absolute before:h-0 before:w-0 before:hover:w-[100%] before:hover:h-[100%] before:duration-500 before:-z-40 after:block after:-right-1 after:-bottom-1 after:bg-black after:absolute after:h-0 after:w-0 after:hover:w-[100%] after:hover:h-[100%] after:duration-500 after:-z-40 bg-white relative inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /> </svg>
                        Guardar
                    </button>
                </form>
                <button type="button" onClick={onClose} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg>
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default ClassroomForm;
