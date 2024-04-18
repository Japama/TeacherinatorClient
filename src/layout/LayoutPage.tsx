// AuthContext.tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../templates/Header';
import UserPage from "../users/UsersPage";
import { Navigate, Route, Routes } from 'react-router-dom';
import IndexPage from '../index/IndexPage';
import DepartmentsPage from '../departments/DepartmentsPage';
import TeachersPage from '../teachers/TeachersPage';
import GroupsPage from '../groups/GroupsPage';
import SchedulesPage from '../schedules/SchedulesPage';
import Footer from '../templates/Footer';
import { useAuth } from '../AuthContext';


function LayoutPage() {
  const { state } = useAuth();

  const renderRoute = (path: string, element: React.ReactElement) => {
    return state.isAdmin ? (
      <Route path={path} element={element} />
    ) : (
      <Route path={path} element={<Navigate to="/login" replace />} />
    );
  };

  return (
    <div className="">
      <Header />
      <ToastContainer />
        <Routes>
          <Route path="/index" element={<IndexPage />} />
          {renderRoute("/departments", <DepartmentsPage />)}
          {renderRoute("/teachers", <TeachersPage />)}
          {renderRoute("/users", <UserPage />)}
          {renderRoute("/groups", <GroupsPage />)}
          {renderRoute("/schedules", <SchedulesPage />)}
        </Routes>
      <Footer />
    </div>
  );
}

export default LayoutPage;
