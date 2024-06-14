import React, { useState } from 'react';
import ClassroomCard from './ClassroomCard';
import { Classroom } from './Classroom';
import ClassroomForm from './ClassroomForm';

interface ClassroomListProps {
    classrooms: Classroom[];
    onCreate: (teacher: Classroom) => void;
    onSave: (classroom: Classroom) => void;
    onDelete: (classroom: Classroom) => void;
}

function ClassroomList({ classrooms, onCreate, onSave, onDelete }: ClassroomListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [classroomBeingEdited, setClassroomBeingEdited] = useState<Classroom | null>(null);
    const [classroomBeingCreated, setClassroomBeingCreated] = useState<Classroom | null>(null);

    const handleEdit = (classroom: Classroom) => {
        setClassroomBeingEdited(classroom);
        setisCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setClassroomBeingEdited(null);
    };

    const items = classrooms.map(classroom => (
        <ClassroomCard key={classroom.id} classroom={classroom} onEdit={handleEdit} onDelete={onDelete} />
    ));


    const openForm = () => {
        setClassroomBeingEdited(new Classroom);
        setisCreate(true);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear aula
            </button>
            {classroomBeingEdited && (
                <ClassroomForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    classroom={classroomBeingEdited}
                    classrooms={classrooms}
                />
            )}
            {classroomBeingCreated && (
                <ClassroomForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    classroom={classroomBeingCreated}
                    classrooms={classrooms}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg text-center">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        {/* <th className="w-[50px] px-6 py-4 text-center ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th> */}
                        <th className="px-6 py-4 text-center">Nombre</th>
                        <th className="px-6 py-4 text-center">Edificio</th>
                        <th className="px-6 py-4 text-center">Planta</th>
                        <th className="px-6 py-4 text-center">Nº</th>
                        <th className="px-6 py-4 text-center">Tipo</th>
                        <th className="px-6 py-4 text-center">Descripción</th>
                        <th className="px-6 py-4 text-center">Editar</th>
                        <th className="px-6 py-4 text-center">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>

        </div>


    );

}

export default ClassroomList;