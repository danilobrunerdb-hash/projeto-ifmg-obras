import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/');
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo-ifmg.png" alt="IFMG" style={{ height: '60px', marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--ifmg-green-dark)' }}>Acesso Restrito</h2>
          <p className="text-muted">Sistema de Gestão de Obras</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--status-not-started)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--ifmg-green-dark)', color: 'white', marginTop: '1rem' }}>
            <Lock size={18} /> Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}
