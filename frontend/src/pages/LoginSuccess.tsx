import React, { useEffect } from "react"
import { useNavigate } from "react-router"

const LoginSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    if (token) {
      localStorage.setItem("token", token)
      window.location.href = "/"
    } else {
      navigate("/login")
    }
  }, [navigate])

  // return <div></div>
}

export default LoginSuccess
