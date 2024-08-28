import React, { useState } from 'react';
import ClassroomCard from './ClassroomCard';
import ClassroomForm from './ClassroomForm';
import { Classroom } from './Classroom';
import { ClassroomType } from '../classrooms_types/ClassroomType';
import { Building } from '../buildings/Building';

interface ClassroomListProps {
    classrooms: Classroom[];
    classroomTypes: ClassroomType[];
    buildings: Building[];
    onCreate: (classroom: Classroom) => void;
    onSave: (classroom: Classroom) => void;
    onDelete: (classroom: Classroom) => void;
    filters: {
        building: string;
        floor: string;
        number: string;
        name: string;
        type_c: string;
        description: string;
    };
    onFilterChange: (field: string, value: string) => void;
    onClearFilters: () => void;
}

function ClassroomList({
    classrooms,
    classroomTypes,
    buildings,
    onCreate,
    onSave,
    onDelete,
    filters,
    onFilterChange,
    onClearFilters
}: ClassroomListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [classroomBeingEdited, setClassroomBeingEdited] = useState<Classroom | null>(null);
    const [classroomBeingCreated, setClassroomBeingCreated] = useState<Classroom | null>(null);

    const handleEdit = (classroom: Classroom) => {
        setClassroomBeingEdited(classroom);
        setIsCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setClassroomBeingEdited(null);
    };

    const openForm = () => {
        setClassroomBeingCreated(new Classroom());
        setIsCreate(true);
        setIsModalOpen(true);
    };

    const items = classrooms.map(classroom => (
        <ClassroomCard
            key={classroom.id}
            classroom={classroom}
            onEdit={handleEdit}
            onDelete={onDelete}
        />
    ));

    return (
        <div className="overflow-x-auto">
            <button
                onClick={openForm}
                className="mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700"
            >
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
                    buildings={buildings}
                    classroomTypes={classroomTypes}
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
                    buildings={buildings}
                    classroomTypes={classroomTypes}
                />
            )}

            <table className="min-w-full border border-gray-200 bg-white shadow-lg text-center">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="px-6 py-4 text-center">Nombre</th>
                        <th className="px-6 py-4 text-center">Edificio</th>
                        <th className="px-6 py-4 text-center">Planta</th>
                        <th className="px-6 py-4 text-center">Nº</th>
                        <th className="px-6 py-4 text-center">Tipo</th>
                        <th className="px-6 py-4 text-center">Descripción</th>
                        <th className="px-6 py-4 text-center" colSpan={2}>Acciones</th>
                    </tr>
                    <tr className="h-[70px] border-b bg-[#596B99] text-[#000000]">
                        <td className="px-6 py-4 text-center">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={filters.name}
                                onChange={(e) => onFilterChange('name', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600"
                            />
                        </td>
                        <td className="px-6 py-4 text-center">
                            <select
                                value={filters.building}
                                onChange={(e) => onFilterChange('building', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600"
                            >
                                <option value="">Seleccionar edificio</option>
                                {buildings.map(building => (
                                    <option key={building.id} value={building.id}>
                                        {building.building_name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <input
                                type="text"
                                placeholder="Planta"
                                value={filters.floor}
                                onChange={(e) => onFilterChange('floor', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600"
                            />
                        </td>
                        <td className="px-6 py-4 text-center">
                            <input
                                type="text"
                                placeholder="Número"
                                value={filters.number}
                                onChange={(e) => onFilterChange('number', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600"
                            />
                        </td>
                        <td className="px-6 py-4 text-center">
                            <select
                                value={filters.type_c}
                                onChange={(e) => onFilterChange('type_c', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600"
                            >
                                <option value="">Seleccionar tipo</option>
                                {classroomTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.type_name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <input
                                type="text"
                                placeholder="Descripción"
                                value={filters.description}
                                onChange={(e) => onFilterChange('description', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600"
                            />
                        </td>
                        <td className="px-6 py-4 text-center" colSpan={2}>
                            <button
                                onClick={onClearFilters}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                Limpiar filtros
                            </button>
                        </td>
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
