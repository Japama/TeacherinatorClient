import React, { useState } from 'react';
import GroupCard from './GroupCard';
import { Group } from './Group';
import GroupForm from './GroupForm';
import { User } from '../users/User';

interface GroupListProps {
    groups: Group[];
    users: User[];
    onCreate: (group: Group) => void;
    onSave: (group: Group) => void;
    onDelete: (group: Group) => void;
    filters: {
        course: string;
        year: string;
        stage: string;
        tutor_name: string;
        letter: string;
    };
    onFilterChange: (field: string, value: string) => void;
    onClearFilters: () => void;
}

function GroupList({ groups, users, onCreate, onSave, onDelete, filters, onFilterChange, onClearFilters }: GroupListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [groupBeingEdited, setGroupBeingEdited] = useState<Group | null>(null);
    const [groupBeingCreated, setGroupBeingCreated] = useState<Group | null>(null);

    // Obtener el año actual
    const currentYear = new Date().getFullYear();

    // Generar una lista de años desde 2022 hasta el año actual
    const yearOptions = [];
    for (let year = 2022; year <= currentYear; year++) {
        yearOptions.push(year);
    }

    const handleEdit = (group: Group) => {
        setGroupBeingEdited(group);
        setIsCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setGroupBeingEdited(null);
    };

    const items = groups.map(group => (
        <GroupCard key={group.id} group={group} onEdit={handleEdit} onDelete={onDelete} />
    ));

    const openForm = () => {
        setGroupBeingEdited(new Group);
        setIsCreate(true);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear grupo
            </button>
            {groupBeingEdited && (
                <GroupForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    group={groupBeingEdited}
                    groups={groups}
                    users={users}
                />
            )}
            {groupBeingCreated && (
                <GroupForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    group={groupBeingCreated}
                    groups={groups}
                    users={users}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg text-center">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="px-6 py-4 text-center">Año</th>
                        <th className="px-6 py-4 text-center">Etapa</th>
                        <th className="px-6 py-4 text-center">Grupo</th>
                        <th className="px-6 py-4 text-center">Tutor</th>
                        <th className="px-6 py-4 text-center" colSpan={2}>Editar</th>
                    </tr>
                    <tr className="h-[70px] border-b bg-[#596B99] text-[#000000]">
                        <td className="px-6 py-4 text-center">
                            <select
                                value={filters.year}
                                onChange={(e) => onFilterChange('year', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600">
                                <option value="">Seleccionar año</option>
                                {yearOptions.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <select
                                value={filters.stage}
                                onChange={(e) => onFilterChange('stage', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600">
                                <option value="">Seleccionar etapa</option>
                                <option value="1">ESO</option>
                                <option value="2">Bachiller</option>
                                <option value="3">DAM</option>
                            </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <select
                                value={filters.course}
                                onChange={(e) => onFilterChange('course', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600">
                                <option value="">Seleccionar curso</option>
                                <option value="1">1º</option>
                                <option value="2">2º</option>
                                <option value="3">3º</option>
                                <option value="4">4º</option>
                            </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <input
                                type="text"
                                placeholder="Nombre del tutor"
                                value={filters.tutor_name}
                                onChange={(e) => onFilterChange('tutor_name', e.target.value)}
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

export default GroupList;
