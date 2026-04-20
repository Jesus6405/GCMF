import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/'); 
        } catch (error) {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo-icon">🚚</div>
                    <h2>GCMF</h2>
                    <p>Sistema de Gestión de Flotas</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            placeholder="usuario@ejemplo.com" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="login-input"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="login-input"
                        />
                    </div>
                    
                    <button type="submit" className="btn-login">
                        Entrar al Sistema
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;