import { useState } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api, { createUsuario } from '../api/users.api';
import { useNavigate } from 'react-router-dom';

const CrearUsuario = () => {
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    rol: 'CONDUCTOR',
    password: '',
    confirmPassword: ''
  });

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword){
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Extraemos el campo confirmPassword porque el backend no lo necesita
      const { confirmPassword, ...datosAEnviar } = formData;
      await createUsuario(datosAEnviar);
      alert('Usuario creado con éxito');
      navigate('/usuarios')
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
          {/* Solo el Gerente puede ver la opción de crear Gerentes o Admins */}
          {user?.rol === 'GERENTE_FLOTA' && (
          <>
            <option value="GERENTE_FLOTA">Gerente de Flota</option>
            <option value="ADMINISTRADOR_OPERATIVO">Administrador Operativo</option>
          </>
          )}
          <option value="CONDUCTOR">Conductor</option>
          <option value="MECANICO">Mecánico</option>
        </select>

        <input type="password" placeholder="Contraseña" 
          onChange={e => setFormData({...formData, password: e.target.value})} required />
        
        <input type="password" placeholder="Confirmar contraseña" 
          onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />

        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p style={{ color: 'red', fontSize: '12px' }}>Las contraseñas no coinciden</p>
        )}

        <button type="submit">Guardar Usuario</button>
      </form>
    </div>
  );
};

export default CrearUsuario;