import React, { useState } from 'react';
import { Teacher } from './Teacher';
import { Department } from '../departments/Department';
import { User } from '../users/User';
import { toast} from 'react-toastify';


interface TeacherFormProps {
    onClose: () => void;
    onEdit: (teacher: Teacher) => void;
    onCreate: (teacher: Teacher) => void;
    onCreateUser: (username: string) => Promise<User>;
    checkUsername: (username: string) => Promise<boolean>;
    isOpen: boolean;
    isCreate: boolean;
    teacher: Teacher;
    departments: Department[];
    users: User[];
    teachers: Teacher[];
    allTeachers: Teacher[];
}

function TeacherForm(props: TeacherFormProps) {
    const { onClose, onEdit, onCreate, onCreateUser, checkUsername, isOpen, isCreate, teacher, departments, users, allTeachers } = props;
    const [editedTeacher, setEditedTeacher] = useState(teacher);
    const [newUserName, setNewUserName] = useState('');
    const [newUserPwd, setNewUserPwd] = useState('');

    const notify = (message: string) => {
        toast(message, { position: "top-center" })
    }

    const handleNewUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUserName(event.target.value);
    };

    const handleNewUserPwdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUserPwd(event.target.value);
    };


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedTeacher = new Teacher({ ...editedTeacher, [event.target.name]: event.target.value });
        setEditedTeacher(updatedTeacher);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedTeacher = new Teacher({ ...editedTeacher, [event.target.name]: event.target.checked });
        setEditedTeacher(updatedTeacher);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(event.target.value);
        const updatedTeacher = new Teacher({ ...editedTeacher, [event.target.name]: value });
        setEditedTeacher(updatedTeacher);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        let userId = editedTeacher.user_id;
        if (isCreate) {
            if (await checkUsername(newUserName)) {
                notify("Ya existe un usuario con ese nombre.");
                return
            } else {
                const newUser = await onCreateUser(newUserName);
                if (newUser.id) {
                    userId = newUser.id;
                }
            }
        }

        const updatedTeacher = new Teacher({ ...editedTeacher, user_id: userId });
        if (editedTeacher.id) {
            onEdit(updatedTeacher);
        } else {
            onCreate(updatedTeacher);
        }

        onClose();
    };

    if (!isOpen) {
        return null;
    }
    const teacherUserIds = allTeachers.map(teacher => teacher.user_id);
    // Filtra los usuarios que no están asociados a un profesor.
    const availableUsers = users.filter((user: User) => user.id !== undefined && !teacherUserIds.includes(user.id));
    const user = users.find((user: User) => user.id === teacher.user_id);
    if (user) {
        availableUsers.push(user);
    }

    return (
        <div className="modal " style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className=" rounded-md modal-content w-full mx-auto lg:w-[500px] drop-shadow-lg bg-white p-12" style={{ position: 'relative', margin: '0 auto', top: '50%', transform: 'translateY(-50%)' }}>
                <h1 className="backdrop-blur-sm text-4xl pb-8">  {editedTeacher.id ? 'Editar profesor' : 'Crear profesor'}</h1>
                <form id="teacherForm" onSubmit={handleSubmit} className="space-y-5">
                    {/* <div className="relative">
                        <label htmlFor="isNewUser" className="block">Crear nuevo usuario:</label>
                        <input
                            id="isNewUser"
                            type="checkbox"
                            name="isNewUser"
                            checked={isNewUser}
                            onChange={handleNewUserChange}
                            className="rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none"
                        />
                    </div> */}
                    {isCreate && (
                        <div className="relative">
                            <label htmlFor="newUserName" className="block">Nombre del nuevo usuario:</label>
                            <input
                                id="newUserName"
                                type="text"
                                name="newUserName"
                                value={newUserName}
                                onChange={handleNewUserNameChange}
                                required
                                className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none"
                            />
                            <label htmlFor="newUserPwd" className="block">Contraseña nueva:</label>
                            <input
                                id="newUserPwd"
                                type="password"
                                name="newUserPwd"
                                value={newUserPwd}
                                onChange={handleNewUserPwdChange}
                                required
                                className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none"
                            />
                        </div>

                    )}
                    {/* {!isCreate && (
                        <div className="relative">
                            <label htmlFor="userId" className="block">Nombre de Usuario:</label>
                            <select id="userId" name="user_id" value={editedTeacher.user_id} onChange={handleSelectChange} required className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none">
                                {isCreate ? (<option value="">Seleccionar</option>) : (<></>)}

                                {availableUsers.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
                            </select>
                        </div>
                    )} */}
                    <div className="relative">
                        <label htmlFor="active" className="block">Activo:</label>
                        <input
                            id="active"
                            type="checkbox"
                            name="active"
                            checked={editedTeacher.active}
                            onChange={handleCheckboxChange}
                            className="rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="departmentId" className="block">Nombre del Departamento:</label>

                        <select id="departmentId" name="department_id" value={editedTeacher.department_id} required onChange={handleSelectChange} className=" text-center rounded-md  p-3 block w-full px-10 drop-shadow-lg outline-none">
                            {isCreate ? (<option value="">Seleccionar</option>) : (<></>)}
                            {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                        </select>
                    </div>
                    <button
                        type="submit"
                        form="teacherForm"
                        className="rounded-md"
                    // disabled={Number(editedTeacher.department_id) === 1}
                    // disabled={!editedTeacher.department_id || (!editedTeacher.user_id && !isNewUser)}
                    >
                        Guardar

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-2 h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
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

export default TeacherForm;



