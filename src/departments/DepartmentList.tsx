import React, { useState, useEffect } from 'react';
import DepartmentCard from './DepartmentCard';
import DepartmentForm from './DepartmentForm';
import { Department } from './Department';

interface DepartmentListProps {
    departments: Department[];
    onCreate: (department: Department) => void;
    onSave: (department: Department) => void;
    onDelete: (department: Department) => void;
    filters: {
        name: string;
    };
    onFilterChange: (field: string, value: string) => void;
}
type FilterKeys = 'name';
function DepartmentList({ departments, onCreate, onSave, onDelete, filters, onFilterChange }: DepartmentListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [departmentBeingEdited, setDepartmentBeingEdited] = useState<Department | null>(null);

    const handleEdit = (department: Department) => {
        setDepartmentBeingEdited(department);
        setisCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setDepartmentBeingEdited(null);
    };

    const filteredDepartments = departments.filter(department =>
        department.name.toLowerCase().includes(filters.name.toLowerCase())
    );

    const items = filteredDepartments.map(department => (
        <DepartmentCard key={department.id} department={department} onEdit={handleEdit} onDelete={onDelete} />
    ));

    const openForm = () => {
        setDepartmentBeingEdited(new Department());
        setisCreate(true);
        setIsModalOpen(true);
    };

    const clearFilters = () => {
        // Clear all filters
        Object.keys(filters).forEach((key) => {
            const filterKey = key as FilterKeys;
            onFilterChange(filterKey, '');
        });
    };

    return (
        <div className="overflow-x-auto">
            <button
                onClick={openForm}
                className="mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700"
            >
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
            <table className="min-w-full border border-gray-200 bg-white shadow-lg text-center">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="px-6 py-4 text-center w-1/3">Nombre</th>
                        <th className="px-6 py-4 text-center w-2/3">Acciones</th>
                        {/* <th className="px-6 py-4 text-center w-1/3">Eliminar</th> */}
                    </tr>
                    <tr className="h-[70px] border-b bg-[#596B99] text-[#000000]">
                        <th>
                            <input
                                type="text"
                                placeholder="Buscar departamento"
                                value={filters.name}
                                onChange={(e) => onFilterChange('name', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600" />
                        </th>
                        <th>
                            <button
                                onClick={clearFilters}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                                Limpiar filtros
                            </button>
                        </th>
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
