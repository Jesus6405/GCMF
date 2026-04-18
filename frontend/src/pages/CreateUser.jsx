import { useState } from 'react';
import api, { createUsuario } from '../api/users.api';

const CrearUsuario = () => {
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    rol: 'CONDUCTOR',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUsuario(formData);
      alert('Usuario creado con éxito');
    } catch (error) {
      alert('Error al crear usuario: ' + error.response?.data?.detail);
    }
  };

  return (
    <div className="container">
      <h2>Registrar Nuevo Personal</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email (Username)" 
          onChange={e => setFormData({...formData, email: e.target.value})} required />
        
        <input type="text" placeholder="Nombre Completo" 
          onChange={e => setFormData({...formData, nombre: e.target.value})} required />
        
        <select value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})}>
          <option value="GERENTE_FLOTA">Gerente de Flota</option>
          <option value="ADMINISTRADOR_OPERATIVO">Administrador Operativo</option>
          <option value="CONDUCTOR">Conductor</option>
          <option value="MECANICO">Mecánico</option>
        </select>

        <input type="password" placeholder="Contraseña Temporal" 
          onChange={e => setFormData({...formData, password: e.target.value})} required />
        
        <button type="submit">Guardar Usuario</button>
      </form>
    </div>
  );
};

export default CrearUsuario;