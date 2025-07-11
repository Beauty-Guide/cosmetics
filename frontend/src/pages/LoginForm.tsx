import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")

  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google"
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isLogin && password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    const request = isLogin
      ? { username, password }
      : { username, email, password }

    const endpoint = isLogin
      ? "http://localhost:8080/auth"
      : "http://localhost:8080/register"

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || "Ошибка авторизации")
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)

      const from = location.state?.from?.pathname || "/"
      navigate(from, { replace: true })
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Произошла ошибка")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? t("login.sign_in") : t("register.sign_up")}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition duration-200"
        >
          <img
            src="https://www.google.com/favicon.ico "
            alt="Google Logo"
            width={20}
            height={20}
          />
          {t("register.sign_in_with_google")}
        </button>

        <div className="flex justify-center space-x-4 my-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 font-medium ${
              isLogin
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {t("login.signing")}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 font-medium ${
              !isLogin
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {t("login.registration")}
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("login.username")}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("login.enter_username")}
            />
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("login.email")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("login.enter_email")}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("login.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("login.enter_password")}
            />
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("register.password_confirmation")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("register.password_confirmation")}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            {isLogin ? t("login.sign_in") : t("login.sign_up")}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
