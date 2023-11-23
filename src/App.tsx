import React, { useState } from 'react';
import './App.css';
import { AuthProvider } from './AuthContext';
import SignInSide from './login/SignInSide';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LayoutPage from "./layout/LayoutPage";

function App() {
return (
    <BrowserRouter>
        <AuthProvider>
            <div className='Body flex flex-col App bg-gray-50 xl:min-w-min'>
                <Routes>
                    <Route path="/" element={<SignInSide/>}/>
                    <Route path="/login" element={<SignInSide/>}/>
                    <Route path="*" element={<LayoutPage/>}/>
                </Routes>
            </div>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
