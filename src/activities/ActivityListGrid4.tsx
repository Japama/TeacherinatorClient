import { Activity } from './Activity';
import ActivityCard from './ActivityCard';
import React, { useState } from 'react';

interface ActivityListProps {
    activities: Activity[];
    onSave: (activity: Activity) => void;
}

function ActivityListGrid4({ activities, onSave }: ActivityListProps) {
    const [activityBeingEdited, setActivityBeingEdited] = useState({});
    const handleEdit = (activity: Activity) => {
        setActivityBeingEdited(activity);
    }
    const cancelEditing = () => {
        setActivityBeingEdited({});
    };
    const items = activities.map(activity => (
        <div key={activity._id} className="md:w-1/2 lg:w-1/3 xl:w-3/4">
            {activity === activityBeingEdited ? (
                <div></div>
                // <ActivityForm
                //     activity={activity}
                //     onSave={onSave}
                //     onCancel={cancelEditing}
                // />
            ) : (
                <ActivityCard activity={activity} onEdit={handleEdit} />
            )}
        </div>
    ));
    return <div className="flex flex-wrap justify-center items-center gap-8 mb-20">{items}</div>;

}

export default ActivityListGrid4;