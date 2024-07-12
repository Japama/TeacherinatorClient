import React, { useState } from 'react';
import ClassroomTypeCard from './ClassroomTypeCard';
import { ClassroomType } from './ClassroomType';
import ClassroomTypeForm from './ClassroomTypeForm';

interface ClassroomTypeListProps {
    classroomtypes: ClassroomType[];
    onCreate: (teacher: ClassroomType) => void;
    onSave: (classroomtype: ClassroomType) => void;
    onDelete: (classroomtype: ClassroomType) => void;
}

function ClassroomTypeList({ classroomtypes, onCreate, onSave, onDelete }: ClassroomTypeListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [classroomtypeBeingEdited, setClassroomTypeBeingEdited] = useState<ClassroomType | null>(null);
    const [classroomtypeBeingCreated, setClassroomTypeBeingCreated] = useState<ClassroomType | null>(null);

    const handleEdit = (classroomtype: ClassroomType) => {
        setClassroomTypeBeingEdited(classroomtype);
        setisCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setClassroomTypeBeingEdited(null);
    };

    const items = classroomtypes.map(classroomtype => (
        <ClassroomTypeCard key={classroomtype.id} classroomtype={classroomtype} onEdit={handleEdit} onDelete={onDelete} />
    ));


    const openForm = () => {
        setClassroomTypeBeingEdited(new ClassroomType);
        setisCreate(true);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear tipo de aula
            </button>
            {classroomtypeBeingEdited && (
                <ClassroomTypeForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    classroomtype={classroomtypeBeingEdited}
                    classroomtypes={classroomtypes}
                />
            )}
            {classroomtypeBeingCreated && (
                <ClassroomTypeForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    classroomtype={classroomtypeBeingCreated}
                    classroomtypes={classroomtypes}
                />
            )}
        <table className="min-w-full border border-gray-200 bg-white shadow-lg text-center">
            <thead>
                <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">  
                        {/* <th className="w-[50px] px-6 py-4 text-center ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th> */}
                        <th className="px-6 py-4 text-center">Nombre</th>
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

export default ClassroomTypeList;