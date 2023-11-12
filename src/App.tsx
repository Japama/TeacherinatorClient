import React, { useState } from 'react';
import './App.css';
import { AuthProvider } from './AuthContext';
import ProjectsPage from './projects/ProjectsPage';
import SignInSide from './login/SignInSide';
import Header from './templates/Header';
import Footer from './templates/Footer';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ActivitiesPage from "./activities/ActivitiesPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

      {/*<div className="flex flex-col h-screen App bg-gray-50">*/}
      {/*  <div className='Header'>*/}
      {/*  </div>*/}
      {/*  <div className='Body xl:min-w-min'>*/}
        <div className='Body flex flex-col App bg-gray-50 xl:min-w-min pt-24'>
          <Header />
          <div className='Content'>
          <Routes>
              <Route path="/" element={<SignInSide/>}/>
              {/*<Route index element={<ProjectsPage/>}/>*/}
              <Route path="login" element={<SignInSide/>}/>
              <Route path="projects" element={<ProjectsPage/>}/>
              <Route path="activities" element={<ActivitiesPage/>}/>
              {/*<Route path="contact" element={<Contact/>}/>*/}
              {/*<Route path="*" element={<NoPage/>}/>*/}
              {/*</Route>*/}
            </Routes>
        </div>
        <Footer />

      </div>
      {/*  <div className='Footer '>*/}
      {/*  </div>*/}
      {/*</div>*/}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
