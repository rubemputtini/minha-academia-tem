import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth';

const ProtectedRoute = ({ children, publicRoute = false }) => {
    const loggedIn = isLoggedIn();

    if (publicRoute) {
        return loggedIn ? <Navigate to="/equipamentos" replace /> : children;
    }

    return loggedIn ? children : <Navigate to="/signup" replace />;
};

export default ProtectedRoute;
