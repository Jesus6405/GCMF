import React, { useState, useEffect, useContext } from 'react';
import AuthContext  from '../context/AuthContext';
import { getDashboardStats } from '../api/dashboard.api';
import { getAllNotifications } from '../api/notifications.api';
import { getAllVehicles } from '../api/vehicles.api';
// Sugerencia: Instala 'recharts' para los gráficos (npm install recharts)
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import '../index.css'; 
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, notificationsData, vehiclesData] = await Promise.all([
          getDashboardStats(),
          getAllNotifications(),
          getAllVehicles()
        ]);
        setStats(statsData);
        setNotifications(notificationsData.data);
        setVehicles(vehiclesData.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  if (loading) return <div className="loader">Cargando Panel...</div>;

  // Datos para el gráfico circular (Donut) basados en tu API
  const fleetStatusData = stats?.vehicles?.by_status?.map(v => ({
    name: v.operational_status,
    value: v.count
  })) || [];

  const COLORS = ['#00C49F', '#F5A623', '#FF4D4F']; // Operativo, En Taller, Fuera

  const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  // Datos para el gráfico de barras (Historial de costos de mantenimiento por mes)
  const maintenanceData = stats?.maintenance?.costs_history?.map(item => {
    let monthLabel = 'N/A';
    if (item.month) {
      const [year, month] = item.month.slice(0, 7).split('-');
      const monthIndex = Number(month) - 1;
      if (!Number.isNaN(monthIndex) && monthIndex >= 0 && monthIndex < 12) {
        monthLabel = `${monthNames[monthIndex]} ${year}`;
      }
    }
    return {
      month: monthLabel,
      cost: item.total_cost
    };
  }) || [];

  // Lista de vehículos con TCO para la tabla
  const vehiclesList = stats?.vehicles?.list || [];
  const totalVehicleKm = stats?.vehicles?.total_km || 0;
  const maintenanceTypeText = stats?.maintenance?.by_type ? stats.maintenance.by_type.map(item => `${item.order_type} (${item.count})`).join(', ') : 'N/A';
  const maintenanceStatusText = stats?.maintenance?.by_status ? stats.maintenance.by_status.map(item => `${item.status} (${item.count})`).join(', ') : 'N/A';

  return (
    <div className="dashboard-layout">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>Panel de Control</h1>
          <span className="date-subtitle">Lunes, 4 de Mayo de 2026</span>
        </div>
        <div className="header-actions">
           <Link to="/vehicles-create" className="btn-link" style={{ textDecoration: 'none' }}>
              Nuevo vehículo &rarr;
            </Link>
           <Link to="/maintenanceOrders-create" className="btn-link" style={{ textDecoration: 'none' }}>
              Nueva OM &rarr;
            </Link>
        </div>
      </header>

      {/* KPI CARDS (FILA 1) */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue">🚚</div>
          <h2>{stats?.vehicles?.total || 0}</h2>
          <p>Total Flota</p>
          {/* Aquí podrías poner el TCO Global en lugar del subtítulo */}
          <small>TCO Global: ${stats?.tco?.total_tco?.toFixed(2)}</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon green">✅</div>
          <h2>{stats?.vehicles?.by_status?.find(s => s.operational_status === 'Operational')?.count || 0}</h2>
          <p>Operativos</p>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon yellow">🔧</div>
          <h2>{stats?.maintenance?.total_orders || 0}</h2>
          <p>Órdenes Activas</p>
        </div>
        <div className="stat-card">
          <h3>Incidentes por urgencia</h3>
          <p className="stat-value">{stats?.incidents?.total || 0}</p>
          <p className="stat-label">Total reportados</p>
          <div className="stat-list">
            {stats?.incidents?.by_urgency?.map(item => (
              <span key={item.urgency_level} className="stat-tag">{item.urgency_level}: {item.count}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS GLOBALES ADICIONALES */}
      <section className="global-stats-grid">
        <div className="stat-card">
          <h3>Mantenimiento</h3>
          <p className="stat-value">${stats?.maintenance?.total_cost?.toFixed(2) || '0.00'}</p>
          <p className="stat-label">Costo total</p>
          <div className="stat-row">
            <span className="stat-small">Tipo: {maintenanceTypeText}</span>
          </div>
          <div className="stat-row">
            <span className="stat-small">Estado: {maintenanceStatusText}</span>
          </div>
          <p className="stat-small">Estimado adicional: ${stats?.tco?.estimated_other_costs?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="stat-card">
          <h3>Costo promedio</h3>
          <p className="stat-value">${stats?.tco?.avg_cost_per_vehicle?.toFixed(2) || '0.00'}</p>
          <p className="stat-label">Por vehículo</p>
          <p className="stat-small">Sobre {stats?.vehicles?.total || 0} vehículos</p>
        </div>
        <div className="stat-card">
          <h3>Kilometraje total</h3>
          <p className="stat-value">{totalVehicleKm.toFixed(0)}</p>
        </div>
      </section>

      {/* GRÁFICOS (FILA 2) */}
      <section className="charts-grid">
        <div className="chart-card main-chart">
          <h3>Historial de Costos de Mantenimiento</h3>
          <p className="subtitle">Por Mes</p>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="cost" fill="#8884d8" name="Costo ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card side-chart">
          <h3>Disponibilidad de Flota</h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={fleetStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {fleetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* TABLAS Y ALERTAS (FILA 3) */}
      <section className="tables-grid">
        <div className="alerts-section">
           <h3>Alertas Activas</h3>
           {notifications.slice(0, 5).map(notification => (
             <div key={notification.id} className={`alert-item ${notification.notif_type === 'LEGAL' ? 'danger' : 'warning'}`}>
               {notification.message}
             </div>
           ))}
        </div>

        <div className="fleet-table-section">
           <div className="table-header-flex">
              <h3>Estado de la Flota</h3>
              <Link to="/vehicles" className="btn-link" style={{ textDecoration: 'none' }}>
              Ver inventario completo &rarr;
              </Link>
           </div>
           <table className="modern-table">
             <thead>
               <tr>
                 <th>Placa</th>
                 <th>Estado</th>
                 <th>TCO Act.</th> {/* <--- AQUÍ VA EL TCO INDIVIDUAL */}
                 <th>Acción</th>
               </tr>
             </thead>
             <tbody>
               {vehiclesList.slice(0, 5).map(vehicle => (
                 <tr key={vehicle.placa}>
                   <td>{vehicle.placa}</td>
                   <td><span className={`badge ${vehicle.operational_status === 'Operational' ? 'green' : vehicle.operational_status === 'In Workshop' ? 'yellow' : 'red'}`}>{vehicle.operational_status}</span></td>
                   <td>${vehicle.tco?.toFixed(2) || '0.00'}</td>
                   <td>👁️</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;