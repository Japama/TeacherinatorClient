import React, { useState } from 'react';
import { Building } from './Building';

interface BuildingFormProps {
    isOpen: boolean;
    isCreate: boolean;
    onClose: () => void;
    onEdit: (building: Building) => void;
    onCreate: (building: Building) => void;
    building: Building;
    buildings: Building[];
}

function BuildingForm(props: BuildingFormProps) {
    const { isOpen, onClose, onEdit, onCreate, building } = props;
    const [editedBuilding, setEditedBuilding] = useState(building);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedBuilding = new Building({ ...editedBuilding, [event.target.name]: event.target.value });
        setEditedBuilding(updatedBuilding);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editedBuilding.id)
            onEdit(editedBuilding);
        else
            onCreate(editedBuilding);
        onClose();

    };


    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="rounded-md modal-content w-full mx-auto lg:w-[500px] drop-shadow-lg bg-white p-12" style={{ position: 'relative', margin: '0 auto', top: '50%', transform: 'translateY(-50%)' }}>
                <h1 className="backdrop-blur-sm text-4xl pb-8">  {building.id ? 'Editar edificio' : 'Crear edificio'}</h1>
                <form id="buildingForm" onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <label htmlFor="building_name" className="block">Edificio</label>
                        <input id="building_name" type="text" name="building_name" required value={editedBuilding.building_name} onChange={handleChange} className="text-center rounded-md p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>
                    <button type="submit" form="buildingForm" className="rounded-md py-2 px-5 mb-4 mt-6 shadow-lg before:block before:-left-1 before:-top-1 before:bg-black before:absolute before:h-0 before:w-0 before:hover:w-[100%] before:hover:h-[100%] before:duration-500 before:-z-40 after:block after:-right-1 after:-bottom-1 after:bg-black after:absolute after:h-0 after:w-0 after:hover:w-[100%] after:hover:h-[100%] after:duration-500 after:-z-40 bg-white relative inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /> </svg>
                        Guardar
                    </button>
                </form>
                <button type="button" onClick={onClose} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg>
                    Cancelar
                </button>
            </div>
        </div>
    );
    
}

export default BuildingForm;
