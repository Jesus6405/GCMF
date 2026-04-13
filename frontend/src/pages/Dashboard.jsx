import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Control GCMF</h1>
      <p>Bienvenido, <strong>{user?.nombre}</strong></p>
      <p>Tu rol es: <code>{user?.rol}</code></p>

      <nav style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {/* Solo Gerentes y Admins ven gestión de usuarios */}
        {['GERENTE_FLOTA', 'ADMINISTRADOR_OPERATIVO'].includes(user?.rol) && (
          <Link to="/usuarios/crear" style={btnStyle}>Gestión de Personal</Link>
        )}

        {/* Conductores ven registro de kilometraje */}
        {user?.rol === 'CONDUCTOR' && (
          <button style={btnStyle}>Registrar Kilometraje</button>
        )}

        <button onClick={logout} style={{ ...btnStyle, background: 'red' }}>Salir</button>
      </nav>
    </div>
  );
};

const btnStyle = { padding: '10px', border: '1px solid #ccc', textDecoration: 'none', color: 'black' };

export default Dashboard;