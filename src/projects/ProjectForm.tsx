import React, { SyntheticEvent, useState } from 'react';
import { Project } from './Project';

interface ProjectFormProps {
    project: Project,
    onSave: (project: Project) => void;
    onCancel: () => void;
}



function ProjectForm({
    project: initialProject,
    onSave,
    onCancel }:
    ProjectFormProps) {
    const [project, setProject] = useState(initialProject);
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        budget: '',
    });
    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        if (!isValid()) return;
        onSave(project);
    };
    const handleChange = (event: any) => {
        const { type, name, value, checked } = event.target;
        // if input type is checkbox use checked
        // otherwise it's type is text, number etc. so use value
        let updatedValue = type === 'checkbox' ? checked : value;

        //if input type is number convert the updatedValue string to a +number
        if (type === 'number') {
            updatedValue = Number(updatedValue);
        }
        const change = {
            [name]: updatedValue,
        };

        let updatedProject: Project;
        // need to do functional update b/c
        // the new project state is based on the previous project state
        // so we can keep the project properties that aren't being edited +like project.id
        // the spread operator (...) is used to
        // spread the previous project properties and the new change
        setProject((p) => {
            updatedProject = new Project({ ...p, ...change });
            console.log(change);
            return updatedProject;
        });
        setErrors(() => validate(updatedProject));
    };

    function validate(project: Project) {
        let errors: any = { name: '', description: '', budget: '' };
        if (project.name.length === 0) {
            errors.name = 'Name is required';
        }
        if (project.name.length > 0 && project.name.length < 3) {
            errors.name = 'Name needs to be at least 3 characters.';
        }
        if (project.description.length === 0) {
            errors.description = 'Description is required.';
        }
        if (project.budget === 0) {
            errors.budget = 'Budget must be more than $0.';
        }
        return errors;
    }

    function isValid() {
        return (
            errors.name.length === 0 &&
            errors.description.length === 0 &&
            errors.budget.length === 0
        );
    }

    return (
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                    <p className="font-medium text-lg">Edit Project</p>
                </div>
            </div>
            <form className="input-group vertical lg:col-span-2"
                onSubmit={handleSubmit}
            >
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                        <label htmlFor="name">Project Name</label>
                        <input type="text" name="name" placeholder="enter name" value={project.name} onChange={handleChange} />
                        {errors.name.length > 0 && (
                            <div className="card error">
                                <p>{errors.name}</p>
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-5">
                        <label htmlFor="description">Project Description</label>
                        <textarea name="description" placeholder="enter description" defaultValue={""} value={project.description} onChange={handleChange} />
                        {errors.description.length > 0 && (
                            <div className="card error">
                                <p>{errors.name}</p>
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-5">
                        <label htmlFor="budget">Project Budget</label>
                        <input type="number" name="budget" placeholder="enter budget" value={project.budget} onChange={handleChange} />
                        {errors.budget.length > 0 && (
                            <div className="card error">
                                <p>{errors.name}</p>
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-5">
                        <label htmlFor="isActive">Active?</label>
                        <input type="checkbox" name="isActive" checked={project.isActive} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-5">
                        <div className="input-group">
                            <button className="bg-gray-700 hover:bg-grey text-white font-bold py-2 px-4 rounded inline-flex items-center">Save</button>
                            <span />
                            <button type="button" className="bg-gray-700 hover:bg-grey text-white font-bold py-2 px-4 rounded inline-flex items-center"
                                onClick={onCancel}
                            >cancel</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default ProjectForm;