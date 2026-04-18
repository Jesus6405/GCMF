import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user } = useContext(AuthContext);

    if (!user) return <Navigate to="/login" />;
    
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/unauthorized" />;
    }

    // Si tiene children (como el Nav), los renderiza. Si no, usa el Outlet.
    return children ? children : <Outlet />;
};

export default ProtectedRoute;