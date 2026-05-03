import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboard.api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Control GCMF - Gerente</h1>
      <p>Bienvenido, <strong>{user?.nombre}</strong></p>
      <p>Tu rol es: <code>{user?.rol}</code></p>

      {/* Estadísticas Clave */}
      <section style={{ marginTop: '30px' }}>
        <h2>Estadísticas Clave</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={cardStyle}>
            <h3>Vehículos Totales</h3>
            <p>{stats?.vehicles?.total || 0}</p>
          </div>
          <div style={cardStyle}>
            <h3>Incidentes Totales</h3>
            <p>{stats?.incidents?.total || 0}</p>
          </div>
          <div style={cardStyle}>
            <h3>Órdenes de Mantenimiento</h3>
            <p>{stats?.maintenance?.total_orders || 0}</p>
          </div>
          <div style={cardStyle}>
            <h3>Kilometraje Total</h3>
            <p>{stats?.odometer?.total_km?.toFixed(2) || 0} km</p>
          </div>
        </div>
      </section>

      {/* Estado de Vehículos */}
      <section style={{ marginTop: '30px' }}>
        <h2>Estado de Vehículos</h2>
        <ul>
          {stats?.vehicles?.by_status?.map((status, index) => (
            <li key={index}>{status.operational_status}: {status.count}</li>
          ))}
        </ul>
      </section>

      {/* Incidentes */}
      <section style={{ marginTop: '30px' }}>
        <h2>Incidentes</h2>
        <div>
          <h3>Por Urgencia</h3>
          <ul>
            {stats?.incidents?.by_urgency?.map((urg, index) => (
              <li key={index}>{urg.urgency_level}: {urg.count}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Por Estado</h3>
          <ul>
            {stats?.incidents?.by_status?.map((stat, index) => (
              <li key={index}>{stat.report_status}: {stat.count}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mantenimiento */}
      <section style={{ marginTop: '30px' }}>
        <h2>Mantenimiento</h2>
        <p>Costo Total: ${stats?.maintenance?.total_cost?.toFixed(2) || 0}</p>
        <div>
          <h3>Por Tipo</h3>
          <ul>
            {stats?.maintenance?.by_type?.map((type, index) => (
              <li key={index}>{type.order_type}: {type.count}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Por Estado</h3>
          <ul>
            {stats?.maintenance?.by_status?.map((stat, index) => (
              <li key={index}>{stat.status}: {stat.count}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* TCO */}
      <section style={{ marginTop: '30px' }}>
        <h2>Costo Total de Propiedad (TCO)</h2>
        <div style={cardStyle}>
          <p><strong>TCO Total de la Flota:</strong> ${stats?.tco?.total_tco?.toFixed(2) || 0}</p>
          <p><strong>Costo Promedio por Vehículo:</strong> ${stats?.tco?.avg_cost_per_vehicle?.toFixed(2) || 0}</p>
          <p><strong>Costo de Mantenimiento:</strong> ${stats?.tco?.maintenance_cost?.toFixed(2) || 0}</p>
          <p><strong>Costos Estimados Adicionales:</strong> ${stats?.tco?.estimated_other_costs?.toFixed(2) || 0}</p>
          <small>Nota: El TCO incluye costos de mantenimiento y una estimación del 20% para otros costos (combustible, seguros, etc.). Para un cálculo más preciso, considera agregar más datos al sistema.</small>
        </div>
      </section>

      <nav style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {/* Solo Gerentes y Admins ven gestión de usuarios */}
        {['GERENTE_FLOTA', 'ADMINISTRADOR_OPERATIVO'].includes(user?.rol) && (
          <Link to="/users" style={btnStyle}>Gestión de Personal</Link>
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
const cardStyle = { border: '1px solid #ddd', padding: '15px', borderRadius: '5px', background: '#f9f9f9' };

export default Dashboard;