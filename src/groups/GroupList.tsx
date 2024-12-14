import React, { useState } from 'react';
import GroupCard from './GroupCard';
import { Group } from './Group';
import GroupForm from './GroupForm';

interface GroupListProps {
    groups: Group[];
    onCreate: (teacher: Group) => void;
    onSave: (group: Group) => void;
    onDelete: (group: Group) => void;
}

function GroupList({ groups, onCreate, onSave, onDelete }: GroupListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [groupBeingEdited, setGroupBeingEdited] = useState<Group | null>(null);
    const [groupBeingCreated, setGroupBeingCreated] = useState<Group | null>(null);

    const handleEdit = (group: Group) => {
        setGroupBeingEdited(group);
        setisCreate(false);
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
        setisCreate(true);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            {/* <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear grupo
            </button> */}
            {groupBeingEdited && (
                <GroupForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    group={groupBeingEdited}
                    groups={groups}
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
                />
            )}
            <table className="min-w-full border border-gray-200 bg-white shadow-lg">
                {/* Table Header */}
                <thead>
                    <tr className="h-[70px] border-b bg-[#141B29] text-[#FFFFFF]">
                        <th className="w-[50px] px-6 py-4 text-start ">
                            <input type="checkbox" id="myCheckbox" className="flex h-6 w-6 items-center rounded-full  border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
                        </th>
                        <th className="px-6 py-4 text-start">Curso</th>
                        <th className="px-6 py-4 text-start">Nombre</th>
                        <th className="px-6 py-4 text-start">Tutor</th>
                        {/* <th className="px-6 py-4 text-start">Editar</th>
                        <th className="px-6 py-4 text-start">Eliminar</th> */}
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