import React, { useEffect, useState } from 'react';
import { Group } from './Group';
import { User } from '../users/User';
import ReactSelect from 'react-select';

interface GroupFormProps {
    isOpen: boolean;
    isCreate: boolean;
    onClose: () => void;
    onEdit: (group: Group) => void;
    onCreate: (group: Group) => void;
    group: Group;
    groups: Group[];
    users: User[];
}

function GroupForm(props: GroupFormProps) {
    const { isOpen, isCreate, onClose, onEdit, onCreate, group, users } = props;
    // Busca el usuario actual en la lista de usuarios
    const currentUser = users.find(user => user.username === group.tutor_name);

    // Establece el usuario seleccionado al usuario actual
    const [selectedUser, setSelectedUser] = React.useState(currentUser ? { value: currentUser.username, label: currentUser.username } : null);

    const [editedGroup, setEditedGroup] = useState(group);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        if (event.target.name === "letter") {
            value = value.toUpperCase();
        }
        const updatedGroup = new Group({ ...editedGroup, [event.target.name]: value });
        setEditedGroup(updatedGroup);
    };

    const handleSelectTutorChange = (selectedOption: any) => {
        setSelectedUser(selectedOption);
        const updatedGroup = new Group({ ...editedGroup, tutor_name: selectedOption.value });
        setEditedGroup(updatedGroup);
    };



    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(event.target.value);
        const updatedGroup = new Group({ ...editedGroup, [event.target.name]: value });
        setEditedGroup(updatedGroup);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editedGroup.id)
            onEdit(editedGroup);
        else
            onCreate(editedGroup);
        onClose();

    };

    useEffect(() => {
        if (!editedGroup.id) {
            const currentYear = new Date().getFullYear();
            const updatedGroup = new Group({ ...editedGroup, year: currentYear.toString() });
            setEditedGroup(updatedGroup);
        }
    }, [editedGroup.id]);


    if (!isOpen) {
        return null;
    }

    interface Option {
        value: string;
        label: string;
    }

    const options: Option[] = users.map(user => ({ value: user.username, label: user.username }));

    return (
        <div className="modal " style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className=" rounded-md modal-content w-full mx-auto lg:w-[500px] drop-shadow-lg bg-white p-12" style={{ position: 'relative', margin: '0 auto', top: '50%', transform: 'translateY(-50%)' }}>
                <h1 className="backdrop-blur-sm text-4xl pb-8">  {group.id ? 'Editar grupo' : 'Crear grupo'}</h1>
                <form id="groupForm" onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <label htmlFor="year" className="block">Curso:</label>
                        <input id="year" type="number" name="year" required value={editedGroup.year} onChange={handleChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" pattern="^(200[1-9]|20[1-9][0-9]|3000)$"
                            title="Por favor, introduzca un año entre 2001 y 3000" />
                    </div>
                    <div className="relative">
                        <label htmlFor="course" className="block">Nivel:</label>
                        <select id="course" name="course" required value={editedGroup.course} onChange={handleSelectChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none">
                            {isCreate ? (<option value="">Seleccionar</option>) : (<></>)}
                            <option value="1">1º</option>
                            <option value="2">2º</option>
                            {editedGroup.stage < 2 && (
                                <>
                                    <option value="3">3º</option>
                                    <option value="4">4º</option>
                                </>
                            )}
                        </select>
                    </div>
                    <div className="relative">
                        <label htmlFor="stage" className="block">Etapa:</label>
                        <select id="stage" name="stage" required value={editedGroup.stage} onChange={handleSelectChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none">
                            {isCreate ? (<option value="">Seleccionar</option>) : (<></>)}
                            <option value="1">ESO</option>
                            <option value="2">Bachiller</option>
                            <option value="3">DAM</option>
                        </select>
                    </div>
                    <div className="relative">
                        <label htmlFor="letter" className="block">Letra:</label>
                        <input id="letter" type="text" name="letter" required pattern="[A-Za-z]" value={editedGroup.letter.toUpperCase()} onChange={handleChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none" />
                    </div>

                    <div className="relative z-50">
                        <label htmlFor="tutor_name" className="block">Tutor:</label>
                        <ReactSelect<Option, false>
                            id="tutor_name"
                            name="tutor_name"
                            value={selectedUser}
                            onChange={handleSelectTutorChange}
                            options={options}
                            className="text-center rounded-md p-3 block w-full px-10 drop-shadow-lg outline-none"
                            isSearchable
                            required
                        />
                    </div>
                    <button type="submit" form="groupForm" className="rounded-md  py-2 px-5 mb-4 mt-6 shadow-lg before:block before:-left-1 before:-top-1 before:bg-black before:absolute before:h-0 before:w-0 before:hover:w-[100%] before:hover:h-[100%]  before:duration-500 before:-z-40 after:block after:-right-1 after:-bottom-1 after:bg-black after:absolute after:h-0 after:w-0 after:hover:w-[100%] after:hover:h-[100%] after:duration-500 after:-z-40 bg-white relative inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /> </svg>
                        Guardar
                    </button>
                </form>
                <button type="button" onClick={onClose} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg>
                    Cancelar
                </button>
            </div >
        </div >
    );
}

export default GroupForm;
