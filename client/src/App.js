import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EquipmentSelectionPage from './pages/EquipmentSelectionPage';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const token = localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={token ? "/equipamentos" : "/signup"} />} />
                
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                <Route 
                    path="/equipamentos" 
                    element={
                        <ProtectedRoute>
                            <EquipmentSelectionPage />
                        </ProtectedRoute>
                    } 
                />

                <Route
                    path="/conta"
                    element={
                        <ProtectedRoute>
                            <AccountPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;