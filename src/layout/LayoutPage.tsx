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
import ClassroomTypesPage from '../classrooms_types/ClassroomTypePage';
import BuildingsPage from '../buildings/BuildingPage';


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
        <Route path="/buildings" element={<BuildingsPage />} />
        <Route path="/current" element={<UserCurrentSchedule />} />
        <Route path="/checkin" element={<UserCheckIn />} />
        <Route path="/center" element={<CentersPage />} />
        <Route path="/centerSchedule" element={<CenterScheduleHoursPage />} />
        <Route path="/classrooms" element={<ClassroomsPage />} />
        <Route path="/classroomTypes" element={<ClassroomTypesPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/index" element={<IndexPage />} />
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path="/users" element={<UserPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default LayoutPage;
