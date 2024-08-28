import React, { useState } from 'react';
import ScheduleCard from './ScheduleCard';
import { Schedule } from './Schedule';
import ScheduleForm from './ScheduleForm';
import { User } from '../users/User';
import ReactSelect from 'react-select';

interface ScheduleListProps {
    schedules: Schedule[];
    onCreate: (teacher: Schedule) => void;
    onSave: (schedule: Schedule) => void;
    onDelete: (schedule: Schedule) => void;
    onViewDetails: (schedule: Schedule) => void;
    filters: {
        course: string;
        user_id: string;
        user_name: string;
        group_name: string;
        only_users: boolean,
        only_groups: boolean,
    };
    onFilterChange: (field: string, value: string) => void;
    onClearFilters: () => void;
    users: User[];
}

interface Option {
    value: number | undefined;
    label: string;
}

function ScheduleList({ schedules, onCreate, onSave, onDelete, onViewDetails, filters, onFilterChange, onClearFilters, users }: ScheduleListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [onlyUsers, setOnlyUsers] = useState(false);
    const [onlyGroups, setOnlyGroups] = useState(false);
    const [scheduleBeingEdited, setScheduleBeingEdited] = useState<Schedule | null>(null);
    const [scheduleBeingCreated] = useState<Schedule | null>(null);
    const [selectedUser, setSelectedUser] = useState<Option | null>(null);

    // Obtiene los años desde el 2022 hasta el actual
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = 2022; year <= currentYear; year++) {
        yearOptions.push(year);
    }

    const defaultOption: Option = { value: undefined, label: 'Seleccionar usuario' };

    const handleEdit = (schedule: Schedule) => {
        setScheduleBeingEdited(schedule);
        setIsCreate(false);
        setIsModalOpen(true);
    };

    const handleSelectUserChange = (selectedOption: Option | null) => {
        if (selectedOption?.value !== undefined) {
            setSelectedUser(selectedOption);
            if (selectedOption && selectedOption.value) {
                onFilterChange('user_id', selectedOption.value.toString());
            }
        } else {
            setSelectedUser(defaultOption);
            onFilterChange('user_id', '');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setScheduleBeingEdited(null);
    };

    const items = schedules.map(schedule => (
        <ScheduleCard key={schedule.id} schedule={schedule} onEdit={handleEdit} onDelete={onDelete} onViewDetails={onViewDetails} />
    ));

    const openForm = () => {
        setScheduleBeingEdited(new Schedule);
        setIsCreate(true);
        setIsModalOpen(true);
    };

    const options: Option[] = [defaultOption, ...users.map(user => ({ value: user.id, label: user.username }))];

    const handleClearFilters = () => {
        setOnlyUsers(false);
        setOnlyGroups(false);
        setSelectedUser(defaultOption);
        onFilterChange('user_id', '');
        onClearFilters();
    };

    const handleCheckboxUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setOnlyUsers(event.target.checked);
            onFilterChange('only_users', event.target.checked.toString());
        } else {
            setOnlyUsers(event.target.checked);
            onClearFilters();
            setSelectedUser(defaultOption);
        }
    };

    const handleCheckboxGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedUser(defaultOption);
            onFilterChange('user_id', '');    
            setOnlyGroups(event.target.checked);
            onFilterChange('only_groups', event.target.checked.toString());
        } else {
            setOnlyGroups(event.target.checked);
            onClearFilters();
        }
    };

    return (
        <div className="overflow-x-auto">
            {/* <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear grupo
            </button> */}
            {scheduleBeingEdited && (
                <ScheduleForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    schedule={scheduleBeingEdited}
                    schedules={schedules}
                />
            )}
            {scheduleBeingCreated && (
                <ScheduleForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    schedule={scheduleBeingCreated}
                    schedules={schedules}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg text-center items-center justify-center">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="px-6 py-4 text-center">Curso</th>
                        <th className="px-6 py-4 text-center">Usuario</th>
                        <th className="px-6 py-4 text-center">Grupo</th>
                        <th className="px-6 py-4 text-center" colSpan={2}>Editar</th>
                    </tr>
                    <tr className="h-[70px] border-b bg-[#596B99] text-[#000000]">
                        <td className="px-6 text-center">
                            <select
                                value={filters.course}
                                onChange={(e) => onFilterChange('course', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600">
                                <option value="">Seleccionar curso</option>
                                {yearOptions.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </td>
                        <td className="px-6 pb-4 text-center ">
                            <ReactSelect<Option, false>
                                id="user_name"
                                name="user_name"
                                value={selectedUser}
                                onChange={handleSelectUserChange}
                                options={options}
                                className="text-center rounded-md p-2 block w-full min-w-[150px] h-[40px] drop-shadow-lg outline-none"
                                isSearchable
                                isDisabled={onlyGroups}
                            />
                        </td>
                        <td className="px-6 text-center">
                            {/* <input
                                type="text"
                                placeholder="Nombre del grupo"
                                value={filters.group_name}
                                onChange={(e) => onFilterChange('group_name', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600" /> */}

                            <div className="flex flex-col items-start space-y-2">
                                <label className="flex items-center">
                                    <input
                                        id="onlyUsers"
                                        name="onlyUsers"
                                        type="checkbox"
                                        checked={onlyUsers}
                                        onChange={handleCheckboxUserChange}
                                        className="mr-2"
                                        disabled={onlyGroups}
                                    />
                                    Solo usuarios
                                </label>
                                <label className="flex items-center">
                                    <input
                                        id="onlyGroups"
                                        type="checkbox"
                                        name="onlyGroups"
                                        checked={onlyGroups}
                                        onChange={handleCheckboxGroupChange}
                                        className="mr-2"
                                        disabled={onlyUsers}
                                    />
                                    Solo grupos
                                </label>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-center" colSpan={2}>

                            <button
                                onClick={handleClearFilters}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-4">
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

export default ScheduleList;
