import React, {useEffect, useState} from 'react';
import Header from "../templates/Header";
import Footer from "../templates/Footer";
import {Route, Routes} from "react-router-dom";
import SignInSide from "../login/SignInSide";
import ActivitiesPage from "../activities/ActivitiesPage";
import ProjectsPage from "../projects/ProjectsPage";
import UserPage from "../users/UsersPage";
import IndexPage from '../index/IndexPage';

function LayoutPage() {
return (
    <>
    <Header />
    <Routes>
        <Route path="/index" element={<IndexPage/>}/>
        <Route path="/activities" element={<ActivitiesPage/>}/>
        <Route path="/users" element={<UserPage/>}/>
    </Routes>
    <Footer />
    </>
  );
}

export default LayoutPage;
