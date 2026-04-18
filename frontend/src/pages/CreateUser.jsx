import { useEffect, useState } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api, { createUsuario } from '../api/users.api';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getUsuario } from '../api/users.api';
import { updateUsuario } from '../api/users.api';

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
  const { id } = useParams();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing){
      const cargarUsuario = async () => {
        try {
          const res = await getUsuario(id); 
          setFormData({
            ...res.data,
            password: '',        // La pass no se pide al cargar
            confirmPassword: ''
          });
        } catch (error) {
          alert("Error al obtener datos del usuario");
        }
      };
      cargarUsuario();
    }
  }, [id, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword){
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Extraemos el campo confirmPassword porque el backend no lo necesita
      const { confirmPassword, ...datosAEnviar } = formData;

      // Si estamos editando y la pass está vacía, la quitamos del envío
      if (isEditing && !datosAEnviar.password) {
        delete datosAEnviar.password;
      }

      if (isEditing) {
        await updateUsuario(id, datosAEnviar); // Llamada a PUT/PATCH
        alert('Usuario actualizado');
      } else {
        await createUsuario(datosAEnviar); // Llamada a POST
        alert('Usuario creado');
      }
      navigate('/usuarios')
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Ocurrió un error'));
    }
  };

  return (
    <div className="container">
      <h2>{isEditing ? 'Editar Usuario' : 'Registrar Nuevo Personal'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email (Username)" 
          onChange={e => setFormData({...formData, email: e.target.value})}
          disabled = {isEditing}
          required 
          value = {formData.email}
        />
        
        <input 
          type="text" 
          placeholder="Nombre Completo" 
          onChange={e => setFormData({...formData, nombre: e.target.value})} 
          required 
          value = {formData.nombre}
        />
        
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

        <input 
          type="password" 
          placeholder={isEditing ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
          onChange={e => setFormData({...formData, password: e.target.value})} 
          required = {!isEditing} //La contraseña no es obligatoria si se esta editando
        />
        
        <input 
          type="password" 
          placeholder="Confirmar contraseña" 
          onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
          required = {!isEditing}
        />

        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p style={{ color: 'red', fontSize: '12px' }}>Las contraseñas no coinciden</p>
        )}

        <button type="submit">
          {isEditing ? 'Actualizar Cambios' : 'Guardar Usuario'}
        </button>
      </form>
    </div>
  );
};

export default CrearUsuario;