import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EquipmentSelectionPage from './pages/EquipmentSelectionPage';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import ThankYouPage from './pages/ThankYouPage';
import AdminPage from './pages/AdminPage';
import UserDetailsPage from './pages/UserDetailsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/signup" replace />} />
                
                <Route 
                    path="/login" 
                    element={
                        <ProtectedRoute publicRoute>
                            <LoginPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/signup" 
                    element={
                        <ProtectedRoute publicRoute>
                            <SignupPage />
                        </ProtectedRoute>
                    } 
                />               
                <Route 
                    path="/equipamentos" 
                    element={
                        <ProtectedRoute>
                            <EquipmentSelectionPage />
                        </ProtectedRoute>
                    } 
                />
                <Route
                    path="/obrigado"
                    element={
                        <ProtectedRoute>
                            <ThankYouPage />
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
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users/:userId"
                    element={
                        <ProtectedRoute>
                            <UserDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;