import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EquipmentSelectionPage from './pages/EquipmentSelectionPage';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import { isLoggedIn } from './services/auth'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn() ? "/equipamentos" : "/signup"} replace />} />
                
                <Route path="/login" element={isLoggedIn() ? <Navigate to="/equipamentos" replace /> : <LoginPage />} />
                <Route path="/signup" element={isLoggedIn() ? <Navigate to="/equipamentos" replace /> : <SignupPage />} />
                
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