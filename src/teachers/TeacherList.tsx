import React, { useState } from 'react';
import { Teacher } from './Teacher';
import TeacherCard from './TeacherCard';
import TeacherForm from './TeacherForm'; // Asegúrate de tener un componente Modal
import { Department } from '../departments/Department';
import { User } from '../users/User';

interface TeacherListProps {
    onCreateTeacher: (teacher: Teacher) => void;
    onSave: (teacher: Teacher) => void;
    onDelete: (teacher: Teacher) => void;
    onCreateUser: (username: string) => Promise<User>;
    checkUsername: (username: string) => Promise<boolean>;
    teachers: Teacher[];
    allTeachers: Teacher[];
    departments: Department[];
    users: User[];
}

function TeacherList({ onSave, onDelete, onCreateTeacher, onCreateUser, checkUsername, teachers, departments, users, allTeachers }: TeacherListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModal, setisCreateModal] = useState(false);
    const [teacherBeingEdited, setTeacherBeingEdited] = useState<Teacher | null>(null);

    const handleCreate = () => {
        setTeacherBeingEdited(new Teacher());
        setisCreateModal(true);
        setIsModalOpen(true);
    };

    const handleEdit = (teacher: Teacher) => {
        setTeacherBeingEdited(teacher);
        setisCreateModal(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTeacherBeingEdited(null);
    };

    const teacherCards = teachers.map(teacher => (
        <TeacherCard key={teacher.id} teacher={teacher} onEdit={handleEdit} onDelete={onDelete} />
    ));


    return (
        <div className="overflow-x-auto">
            <button
                onClick={handleCreate}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear docente
            </button>
            {teacherBeingEdited && (
                <TeacherForm
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreateTeacher}
                    onCreateUser={onCreateUser}
                    checkUsername={checkUsername}
                    isOpen={isModalOpen}
                    isCreate={isCreateModal}
                    departments={departments}
                    users={users}
                    teacher={teacherBeingEdited}
                    teachers={teachers}
                    allTeachers={allTeachers}
                />
            )}
            {!teacherBeingEdited && (
                <TeacherForm
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreateTeacher}
                    onCreateUser={onCreateUser}
                    checkUsername={checkUsername}
                    isOpen={isModalOpen}
                    isCreate={isCreateModal}
                    departments={departments}
                    users={users}
                    teacher={new Teacher()}
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
                    {teacherCards}
                </tbody>
            </table>

        </div>
    );

}

export default TeacherList;