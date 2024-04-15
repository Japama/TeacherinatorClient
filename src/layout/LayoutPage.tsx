import Header from "../templates/Header";
import Footer from "../templates/Footer";
import { Route, Routes } from "react-router-dom";
import UserPage from "../users/UsersPage";
import IndexPage from '../index/IndexPage';
import TeachersPage from '../teachers/TeachersPage';
import DepartmentsPage from "../departments/DepartmentsPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function LayoutPage() {
  return (
    <div className="">
      <Header />
      <ToastContainer />
        <Routes>
          <Route path="/index" element={<IndexPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/users" element={<UserPage />} />
        </Routes>
      <Footer />
    </div>
  );
}

export default LayoutPage;
