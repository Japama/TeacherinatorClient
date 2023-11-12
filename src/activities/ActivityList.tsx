import { Activity } from './Activity';
import ActivityCard from './ActivityCard';
import React, { useState } from 'react';

interface ActivityListProps {
    activities: Activity[];
    onSave: (activity: Activity) => void;
}

function ActivityList({ activities, onSave }: ActivityListProps) {
    const [activityBeingEdited, setActivityBeingEdited] = useState({});
    const handleEdit = (activity: Activity) => {
        setActivityBeingEdited(activity);
    }
    const cancelEditing = () => {
        setActivityBeingEdited({});
    };
    const items = activities.map(activity => (
        <div key={activity._id} className="w-full">
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
    return <div className="flex flex-wrap justify-center items-center gap-8 p-4">{items}</div>;

}

export default ActivityList;