import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/auth/login', { nim, password });
      login(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl shadow-xl w-96">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <h2 className="text-2xl font-bold">EventHub</h2>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Login dengan NIM & Password</p>
        </div>
        <input
          type="text"
          placeholder="NIM"
          className="w-full p-3 mb-4 bg-slate-700 rounded text-white"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-slate-700 rounded text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 p-3 rounded font-bold hover:bg-sky-600"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
};

export default Login;