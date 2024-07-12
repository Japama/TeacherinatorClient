import React, { useState } from 'react';
import BuildingCard from './BuildingCard';
import { Building } from './Building';
import BuildingForm from './BuildingForm';

interface BuildingListProps {
    buildings: Building[];
    onCreate: (teacher: Building) => void;
    onSave: (building: Building) => void;
    onDelete: (building: Building) => void;
}

function BuildingList({ buildings, onCreate, onSave, onDelete }: BuildingListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreate, setisCreate] = useState(false);
    const [buildingBeingEdited, setBuildingBeingEdited] = useState<Building | null>(null);
    const [buildingBeingCreated, setBuildingBeingCreated] = useState<Building | null>(null);

    const handleEdit = (building: Building) => {
        setBuildingBeingEdited(building);
        setisCreate(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setBuildingBeingEdited(null);
    };

    const items = buildings.map(building => (
        <BuildingCard key={building.id} building={building} onEdit={handleEdit} onDelete={onDelete} />
    ));


    const openForm = () => {
        setBuildingBeingEdited(new Building);
        setisCreate(true);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <button
                onClick={openForm}
                className={`mb-4 items-center rounded-full bg-green-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-green-700`}>
                Crear edificio
            </button>
            {buildingBeingEdited && (
                <BuildingForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    building={buildingBeingEdited}
                    buildings={buildings}
                />
            )}
            {buildingBeingCreated && (
                <BuildingForm
                    isOpen={isModalOpen}
                    isCreate={isCreate}
                    onClose={closeModal}
                    onEdit={onSave}
                    onCreate={onCreate}
                    building={buildingBeingCreated}
                    buildings={buildings}
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

export default BuildingList;