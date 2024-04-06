import React, { useState } from 'react';
import { User } from './User';

interface UserFormProps {
    user: User;
    onSave: (user: User) => void;
    onCancel: () => void;
}

function UserForm({ user, onSave, onCancel }: UserFormProps) {
    const [editedUser, setEditedUser] = useState(user);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedUser({ ...editedUser, [event.target.name]: event.target.value, isNew: editedUser.isNew || false });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave(editedUser);
    };

    return (
        <tr className="h-[70px] border-b bg-[#484D58] text-[#FFFFFF]">
            <td className="px-6 py-4 text-start">
                <input type="checkbox" id="myCheckbox" className="flex h-6 w-6  items-center rounded-full border-2 border-red-500 bg-red-500 text-red-500 focus:border-red-400 focus:ring-red-400" />
            </td>
            <td className="px-6 py-4 text-start text-black">
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type="text" name="username" value={editedUser.username} onChange={handleChange} />
                    </label>
                    {/* Añade más campos según sea necesario */}
                </form>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="px-6 py-4 text-start">
                <button type="submit" form="userForm" className="flex items-center rounded-full bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /> </svg>
                    Guardar
                </button>
            </td>
            <td className="px-6 py-4 text-start">
                <button type="button" onClick={onCancel} className="flex items-center rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-md transition-all duration-300 hover:bg-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> </svg>
                    Cancelar
                </button>
            </td>
        </tr>
    );
    
    

}

export default UserForm;
