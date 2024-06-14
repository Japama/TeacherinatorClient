import './App.css';
import { AuthProvider } from './auth/AuthContext';
import SignInSide from './auth/SignInSide';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutPage from "./layout/LayoutPage";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="App flex flex-col min-h-screen bg-gray-400 dark:bg-[#393E46]">
                    <main className="flex-grow flex flex-col items-center justify-center">
                        <Routes>
                            <Route path="/" element={<SignInSide />} />
                            <Route path="/login" element={<SignInSide />} />
                            <Route path="*" element={<LayoutPage />} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
