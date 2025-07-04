import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import type { JwtRequest, JwtResponse } from '../types/auth';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const request: JwtRequest = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:8080/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }

      const data: JwtResponse = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);

        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('Неверные учетные данные');
      console.error(err);
    }
  };

  return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Войти</h2>

        {/* Сообщение об ошибке */}
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* Форма входа */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Поле логина */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Имя пользователя
            </label>
            <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите имя пользователя"
            />
          </div>

          {/* Поле пароля */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите пароль"
            />
          </div>

          {/* Кнопка отправки */}
          <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Войти
          </button>
        </form>
      </div>
  );
};

export default LoginForm;