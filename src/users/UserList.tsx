import React, { useState } from 'react';
import { User } from './User';
import UserCard from './UserCard';
import UserForm from './UserForm';
import { Department } from '../departments/Department';

interface UserListProps {
    users: User[];
    onCreate: (user: User, changePassword: boolean) => void;
    onSave: (user: User, changePassword: boolean) => void;
    onDelete: (user: User) => void;
    checkUsername: (username: string) => Promise<boolean>;
    departments: Department[];
    filters: {
        username: string;
        is_admin: string;
        teacher: string;
        department: string;
        active: string;
    };
    onFilterChange: (field: string, value: string) => void;
}
type FilterKeys = 'username' | 'is_admin' | 'teacher' | 'department' | 'active';

function UserList({ users, onCreate, onSave, onDelete, checkUsername, departments, filters, onFilterChange }: UserListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [userBeingEdited, setUserBeingEdited] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setUserBeingEdited(user);
        setisCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserBeingEdited(null);
    };

    const items = users.map(user => (
        <UserCard key={user.id} user={user} onEdit={handleEdit} onDelete={onDelete} />
    ));

    const openForm = () => {
        setUserBeingEdited(new User());
        setisCreate(true);
        setIsModalOpen(true);
    };

    const handleFilterButtonClick = (field: FilterKeys, value: string) => {
        if (filters[field] === value) {
            // If the filter value is already applied, remove it
            onFilterChange(field, '');
        } else {
            // Otherwise, apply the new filter value
            onFilterChange(field, value);
        }
    
        if (field === 'teacher') {
            if (value === 'false') {
                console.log("Pulsado");
                // If teacher is set to false, set department to "Ninguno"
                onFilterChange('department', '1');
            // } else if (value === 'true') {
            } else {
                console.log("Nada");
                // onFilterChange('department', '0');
                // If teacher is set to true, ensure department is not "Ninguno"
                if (filters.department === '1') {
                    // If department is currently set to "Ninguno", clear it
                    // onFilterChange('department', '2');
                }
            }
        }
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
                Crear Usuario
            </button>
            {userBeingEdited && (
                <UserForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    user={userBeingEdited}
                    checkUsername={checkUsername}
                    departments={departments}
                />
            )}
            {!userBeingEdited && (
                <UserForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    user={new User()}
                    checkUsername={checkUsername}
                    departments={departments}
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg text-center">
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="px-6 py-4 text-center">Nombre</th>
                        <th className="px-6 py-4 text-center">Administrador</th>
                        <th className="px-6 py-4 text-center">Docente</th>
                        <th className="px-6 py-4 text-center">Departamento</th>
                        <th className="px-6 py-4 text-center">Activo</th>
                        <th colSpan={2} className="px-6 py-4 text-center">Editar</th>
                        {/* <th className="px-6 py-4 text-center">Eliminar</th> */}
                    </tr>
                    <tr className="h-[70px] border-b bg-[#596B99] text-[#000000]">
                        <td className="px-6 py-4 text-center">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={filters.username}
                                onChange={(e) => onFilterChange('username', e.target.value)}
                                className="p-2 border border-gray-300 rounded placeholder-gray-600"
                            />
                        </td>
                        <td className="px-6 py-4 text-center">
                            <button
                                onClick={() => handleFilterButtonClick('is_admin', 'true')}
                                className={`p-2 rounded ${filters.is_admin === 'true' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                            >
                                ✔
                            </button>
                            <button
                                onClick={() => handleFilterButtonClick('is_admin', 'false')}
                                className={`p-2 rounded ${filters.is_admin === 'false' ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
                            >
                                ✘
                            </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                        
                        </td>
                        <td className="px-6 py-4 text-center">
                            <select
                                value={filters.department}
                                onChange={(e) => onFilterChange('department', e.target.value)}
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="">Seleccionar departamento</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <button
                                onClick={() => handleFilterButtonClick('active', 'true')}
                                className={`p-2 rounded ${filters.active === 'true' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                            >
                                ✔
                            </button>
                            <button
                                onClick={() => handleFilterButtonClick('active', 'false')}
                                className={`p-2 rounded ${filters.active === 'false' ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
                            >
                                ✘
                            </button>
                        </td>
                        <td colSpan={2} className="px-6 py-4 text-center">
                            <button
                                onClick={clearFilters}
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

export default UserList;
