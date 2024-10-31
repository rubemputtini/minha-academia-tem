import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth';

const ProtectedRoute = ({ children }) => {

    if (!isLoggedIn()) {
        return <Navigate to="/signup" replace />;
    }

    return children;
};


export default ProtectedRoute;
