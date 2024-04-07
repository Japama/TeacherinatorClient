import React, { useState } from 'react';
import { Teacher } from './Teacher';
import TeacherCard from './TeacherCard';
import TeacherForm from './TeacherForm'; // Asegúrate de tener un componente Modal
import { Department } from '../departments/Department';
import { User } from '../users/User';
import { getAllByAltText } from '@testing-library/react';

interface TeacherListProps {
    teachers: Teacher[];
    allTeachers: Teacher[];
    onCreateUser: (username: string) => Promise<User>;
    onCreateTeacher: (teacher: Teacher) => void;
    onSave: (teacher: Teacher) => void;
    onDelete: (teacher: Teacher) => void;
    departments: Department[];
    users: User[];
}

function TeacherList({ teachers, onSave, onDelete, onCreateUser, onCreateTeacher, departments, users, allTeachers }: TeacherListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModal, setisCreateModal] = useState(false);
    const [teacherBeingEdited, setTeacherBeingEdited] = useState<Teacher | null>(null);
    const [teacherBeingCreated, setTeacherBeingCreated] = useState<Teacher | null>(null);

    const handleEdit = (teacher: Teacher) => {
        setTeacherBeingEdited(teacher);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTeacherBeingEdited(null);
    };

    const items = teachers.map(teacher => (
        <TeacherCard key={teacher.id} teacher={teacher} onEdit={handleEdit} onDelete={onDelete} />
    ));

    const openForm = () => {
        setTeacherBeingEdited(new Teacher);
        setisCreateModal(true);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear docente
            </button>
            {teacherBeingEdited && (
                <TeacherForm
                    isOpen={isModalOpen}
                    isCreate={isCreateModal}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreateTeacher}
                    onCreateUser={onCreateUser}
                    teacher={teacherBeingEdited}
                    departments={departments}
                    users={users}
                    teachers={teachers}
                    allTeachers={allTeachers}
                />
            )}
            {teacherBeingCreated && (
                <TeacherForm
                    isOpen={isModalOpen}
                    isCreate={isCreateModal}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreateTeacher}
                    onCreateUser={onCreateUser}
                    teacher={teacherBeingCreated}
                    departments={departments}
                    users={users}
                    teachers={teachers}
                    allTeachers={allTeachers}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg">
                {/* Table Header */}
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="w-[50px] px-6 py-4 text-start ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th>
                        <th className="px-6 py-4 text-start">Usuario</th>
                        <th className="px-6 py-4 text-start">Departamento</th>
                        <th className="px-6 py-4 text-start">Activo</th>
                        <th className="px-6 py-4 text-start">Editar</th>
                        <th className="px-6 py-4 text-start">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>

        </div>
    );

}

export default TeacherList;