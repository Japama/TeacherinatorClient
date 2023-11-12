import { Project } from './Project';

function formatDescription(description: string): string {
  return description.substring(0, 60) + '...';
}

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

function ProjectCard(props: ProjectCardProps) {
  const { project, onEdit } = props;
  const handleEditClick = (projectBeingEdited: Project) => {
    onEdit(projectBeingEdited);
  };
  return (
    <div className="da relative flex h-96 flex-col justify-center overflow-hidden bg-gray-50">
      {/* <div className="absolute inset-0 bg-center dark:bg-black"></div> */}
      <div className="group relative m-0 flex h-72 w-96 rounded-xl shadow-xl ring-gray-900/5 sm:mx-auto sm:max-w-lg">
        <div className='z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70'>
          <img src={project.imageUrl} alt={project.name} className='animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110' />
        </div>
        <section className="absolute bottom-0 z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
          <h5 className="bg-opacity-50 bg-gray-700 font-serif text-2xl font-bold text-white shadow-xl">
            <strong>{project.name}</strong>
          </h5>
          <p className='bg-opacity-50 bg-gray-700 text-sm font-light text-gray-200 shadow-xl'>{formatDescription(project.description)}</p>
          <p className='bg-opacity-50 bg-gray-700 text-sm font-light text-gray-200 shadow-xl'>Budget : {project.budget.toLocaleString()}</p>
          <button className="bg-gray-700 hover:bg-grey text-white font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={() => {
              handleEditClick(project);
            }}>
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><path strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <span>Edit</span>
          </button>

        </section>

      </div>
    </div>
  );
}

export default ProjectCard;