import React, {useEffect, useState} from 'react';
import Header from "../templates/Header";
import Footer from "../templates/Footer";
import {Route, Routes} from "react-router-dom";
import SignInSide from "../login/SignInSide";
import ActivitiesPage from "../activities/ActivitiesPage";
import ProjectsPage from "../projects/ProjectsPage";

function LayoutPage() {
return (
    <>
    <Header />
    <Routes>
        <Route path="/activities" element={<ActivitiesPage/>}/>
        <Route path="/projects" element={<ProjectsPage/>}/>
    </Routes>
    <Footer />
    </>
  );
}

export default LayoutPage;
