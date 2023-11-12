import {Activity} from './Activity';

interface ActivityCardProps {
    activity: Activity;
    onEdit: (activity: Activity) => void;
}

function ActivityCard(props: ActivityCardProps) {
    const {activity, onEdit} = props;
    const handleEditClick = (activityBeingEdited: Activity) => {
        onEdit(activityBeingEdited);
    };
    return (
        <section className="transform bg-white dark:bg-gray-900 shadow-md hover:scale-105 hover:shadow-2xl cursor-pointer rounded-3xl mx-20 hover:transition-all duration-300 hover:duration-300">
            <div className="lg:grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-7">
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">{activity.name}</h1>
                    <p className="inline-flex items-start justify-between max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 mx-2">Deporte: {activity.sport_id}</p>
                    <p className="inline-flex items-end justify-between max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 mx-2">Categoría: {activity.category}</p>
                    <p className="max-w-2xl mb-6 text-gray-900 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                        {activity.description}
                        {activity.description}
                        {activity.description}
                        {activity.description}
                        {activity.description}
                        {activity.description}
                        {activity.description}
                        {activity.description}
                        {activity.description}
                        {activity.description}
                    </p>
                    <a href="#"
                       className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                        Detalles
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                        </svg>
                    </a>
                </div>
                <div className="hidden lg:mt-0 lg:col-span-5 lg:flex rounded-lg">
                    <img src="https://lp-cms-production.imgix.net/2019-06/554369495_full.jpg" alt="mockup"
                         className="rounded-lg"/>
                </div>

                <div className='inline-flex mt-2'>
                    <div className="flex items-center ">
                        <svg className="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path
                                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                        </svg>
                        <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">{activity.rating}</p>
                        <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"/>
                        <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{activity.reviews} opiniones</p>
                        {/* <a href="#" className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white">{activity.reviews}</a> */}
                    </div>

                    <div className="flex flex-wrap lg:flex-nowrap ml-4">
                        {activity.tags.map((tag, index) => (<p key={activity._id + tag + index}
                                                        className="w-1/2 md:w-1/3 max-w-2xl font-light text-gray-500 md:text-lg lg:text-xl dark:text-gray-400 ml-2">#{tag}</p>))}
                    </div>
                </div>
            </div>
        </section>);
}

export default ActivityCard;