import { useEffect, useState } from 'react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api, { createUser } from '../api/users.api';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getUser } from '../api/users.api';
import { updateUser } from '../api/users.api';

const UsersFormPage = () => {
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
      const loadUser = async () => {
        try {
          const res = await getUser(id); 
          setFormData({
            ...res.data,
            password: '',        // La pass no se pide al cargar
            confirmPassword: ''
          });
        } catch (error) {
          alert("Error al obtener datos del usuario");
        }
      };
      loadUser();
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
        await updateUser(id, datosAEnviar); // Llamada a PUT/PATCH
        alert('Usuario actualizado');
      } else {
        await createUser(datosAEnviar); // Llamada a POST
        alert('Usuario creado');
      }
      navigate('/users')
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Ocurrió un error'));
    }
  };

  return (
    <div className="form-page-container">
    <header className="form-header">
        <div className="header-info">
            <span className="breadcrumb">Gestión de Personal · Registro de Usuarios</span>
            <h1>{isEditing ? 'Editar Usuario' : 'Registrar Nuevo Personal'}</h1>
            <p>El correo electrónico funcionará como el nombre de usuario para el acceso al sistema.</p>
        </div>
    </header>

    <form onSubmit={handleSubmit} className="elaborated-form">
        <div className="form-main-content">
            
            {/* SECCIÓN 1: Datos Personales y Rol */}
            <section className="form-section-card">
                <div className="section-title">
                    <span className="icon">👤</span>
                    <h3>Datos del Personal</h3>
                </div>
                <div className="grid-form-fields dual-column">
                    <div className="form-group full-width">
                        <label>Nombre Completo <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="nombre" 
                            placeholder="Ej: Juan Pérez" 
                            onChange={e => setFormData({...formData, nombre: e.target.value})} 
                            required 
                            value={formData.nombre}
                        />
                    </div>
                    
                    <div className="form-group full-width">
                        <label>Rol Asignado <span className="required">*</span></label>
                        <select 
                            value={formData.rol} 
                            onChange={e => setFormData({...formData, rol: e.target.value})}
                        >
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
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: Credenciales */}
            <section className="form-section-card">
                <div className="section-title">
                    <span className="icon">🔐</span>
                    <h3>Credenciales de Acceso</h3>
                </div>
                <div className="grid-form-fields dual-column">
                    <div className="form-group full-width">
                        <label>Email (Username) <span className="required">*</span></label>
                        <input 
                            type="email" 
                            placeholder="correo@empresa.com" 
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            disabled={isEditing}
                            required 
                            value={formData.email}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Contraseña {isEditing ? "" : <span className="required">*</span>}
                        </label>
                        <input 
                            type="password" 
                            placeholder={isEditing ? "Dejar vacío para no cambiar" : "Contraseña segura"}
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            required={!isEditing}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>
                            Confirmar Contraseña {isEditing ? "" : <span className="required">*</span>}
                        </label>
                        <input 
                            type="password" 
                            placeholder="Repita la contraseña" 
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                            required={!isEditing}
                        />
                        {/* Mensaje de error de validación */}
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                                Las contraseñas no coinciden
                            </span>
                        )}
                    </div>
                </div>
            </section>
            
            {/* ZONA DE BOTONES */}
            <div className="form-submit-zone">
                <button type="submit" className="btn btn-save">
                    {isEditing ? 'Actualizar Cambios' : 'Guardar Usuario'}
                </button>
            </div>
        </div>

        {/* SIDEBAR INFORMATIVO (Mantiene la estructura del layout original) */}
        <aside className="form-sidebar-content">
            <div className="side-card photo-placeholder">
                <div className="section-title">
                    <span className="icon">ℹ️</span>
                    <h3>Información de Roles</h3>
                </div>
                <div className="upload-box" style={{ textAlign: 'left', padding: '15px' }}>
                    <p style={{ fontSize: '13px', marginBottom: '10px' }}>
                        <strong>Administrador Operativo:</strong> Acceso a gestión de vehículos y usuarios.
                    </p>
                    <p style={{ fontSize: '13px', marginBottom: '10px' }}>
                        <strong>Conductor:</strong> Solo puede registrar kilometraje y ver sus unidades asignadas.
                    </p>
                    <p style={{ fontSize: '13px' }}>
                        <strong>Mecánico:</strong> Acceso exclusivo a órdenes de mantenimiento e historial de reparaciones.
                    </p>
                </div>
            </div>
        </aside>
    </form>
</div>
  );
};

export default UsersFormPage;