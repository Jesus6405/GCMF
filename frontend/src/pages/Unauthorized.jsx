const Unauthorized = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>Acceso Denegado</h1>
    <p>No tienes los permisos necesarios para ver esta sección.</p>
    <a href="/dashboard">Volver al inicio</a>
  </div>
);

export default Unauthorized;