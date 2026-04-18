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
        <form onSubmit={handleSubmit}>
            <h2>GCMF - Inicio de Sesión</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Entrar</button>
        </form>
    );
};

export default Login;