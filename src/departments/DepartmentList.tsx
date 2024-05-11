import React, { useState } from 'react';
import DepartmentCard from './DepartmentCard';
import { Department } from './Department';
import DepartmentForm from './DepartmentForm';

interface DepartmentListProps {
    departments: Department[];
    onCreate: (teacher: Department) => void;
    onSave: (department: Department) => void;
    onDelete: (department: Department) => void;
}

function DepartmentList({ departments, onCreate, onSave, onDelete }: DepartmentListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [departmentBeingEdited, setDepartmentBeingEdited] = useState<Department | null>(null);
    const [departmentBeingCreated, setDepartmentBeingCreated] = useState<Department | null>(null);

    const handleEdit = (department: Department) => {
        setDepartmentBeingEdited(department);
        setisCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setDepartmentBeingEdited(null);
    };

    const items = departments.map(department => (
        <DepartmentCard key={department.id} department={department} onEdit={handleEdit} onDelete={onDelete} />
    ));


    const openForm = () => {
        setDepartmentBeingEdited(new Department);
        setisCreate(true);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear departamento
            </button>
            {departmentBeingEdited && (
                <DepartmentForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    department={departmentBeingEdited}
                    departments={departments}
                />
            )}
            {departmentBeingCreated && (
                <DepartmentForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    department={departmentBeingCreated}
                    departments={departments}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        {/* <th className="w-[50px] px-6 py-4 text-start ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th> */}
                        <th className="px-6 py-4 text-start">Nombre</th>
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

export default DepartmentList;