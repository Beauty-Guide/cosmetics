import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import type { JwtRequest, JwtResponse } from '../types/auth';
import {Input} from "@/components/ui/input.tsx";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const request = {
      username,
      password,
    };

    try {
      const endpoint = isLogin ? 'http://localhost:8080/auth' : 'http://localhost:8080/register';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.status === 409) {
        const data = await response.json();
        throw new Error(data.error)// "Username is already taken"
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || (isLogin ? 'Ошибка авторизации' : 'Ошибка регистрации'));
      }

      const data: JwtResponse = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: "url('../../../frontend/public/images/D0YXNI1YaT.png')" }}>
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </h2>

          {/* Сообщение об ошибке */}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          {/* Переключатель между формами */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 font-medium ${
                    isLogin
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-blue-600'
                }`}
            >
              Вход
            </button>
            <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 font-medium ${
                    !isLogin
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-blue-600'
                }`}
            >
              Регистрация
            </button>
          </div>

          {/* Форма */}
          <form onSubmit={handleAuth} className="space-y-4">
            {/* Поле логина */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Имя пользователя
              </label>
              <Input
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
              <Input
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
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default LoginForm;