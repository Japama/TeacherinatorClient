// AuthContext.tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../templates/Header';
import UserPage from "../users/UsersPage";
import { Route, Routes } from 'react-router-dom';
import IndexPage from '../index/IndexPage';
import CenterScheduleHoursPage from '../centerSchedules/CenterScheduleHoursPage';
import DepartmentsPage from '../departments/DepartmentsPage';
import GroupsPage from '../groups/GroupsPage';
import SchedulesPage from '../schedules/SchedulesPage';
import Footer from '../templates/Footer';
import UserCurrentSchedule from '../users/UserCurrentSchedule';
import UserCheckIn from '../users/UserCheckIn ';
import ClassroomsPage from '../classrooms/ClassroomPage';
import CentersPage from '../center/CenterPage';


function LayoutPage() {
  const renderRoute = (path: string, element: React.ReactElement) => {
    return <Route path={path} element={element} />
  };

  return (
    <div className=" min-h-screen pb-36 pt-12 w-screen">
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/*" element={<IndexPage />} />
        <Route path="/index" element={<IndexPage />} />
        {renderRoute("/departments", <DepartmentsPage />)}
        {renderRoute("/center", <CentersPage />)}
        {renderRoute("/classrooms", <ClassroomsPage />)}
        {/* {renderRoute("/teachers", <TeachersPage />)} */}
        {renderRoute("/users", <UserPage />)}
        {renderRoute("/groups", <GroupsPage />)}
        {renderRoute("/schedules", <SchedulesPage />)}
        {renderRoute("/centerSchedule", <CenterScheduleHoursPage />)}
        <Route path="/current" element={<UserCurrentSchedule />} />
        <Route path="/checkin" element={<UserCheckIn />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default LayoutPage;
