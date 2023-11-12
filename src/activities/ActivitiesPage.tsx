import React, {useEffect, useState} from 'react';
import { MOCK_ACTIVITIES } from './MockActivities';
import ActivityList from './ActivityList';
import { Activity } from './Activity';
import ActivityListGrid4 from './ActivityListGrid4';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


function ActivitiesPage() {
    const navigate = useNavigate();

  const [Activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES)
  const saveActivity = (Activity: Activity) => {
    let updatedActivities = Activities.map((a: Activity) => {
      return a._id === Activity._id ? Activity : a;
    });
    setActivities(updatedActivities);
  };

    useEffect(() => {
        const fetchData = async () => {
            const miCookie = Cookies.get('loged_in');
                if(miCookie !== "true") {
                navigate("/login");
            }
        };

        fetchData();
    }, []); // El array vacío [] significa que este efecto se ejecutará una vez, justo después de que el componente se monte.


    return (
    <div className="items-center justify-center bg-gray-50">
      <div className='p-8 pt-auto text-3xl font-semibold text-gray-800'>
      <h1>Actividades</h1>
      </div>
      <ActivityList onSave={saveActivity} activities={Activities} />
      {/*<ActivityListGrid4 onSave={saveActivity} activities={Activities} />*/}
    </div>
  );
}

export default ActivitiesPage;
