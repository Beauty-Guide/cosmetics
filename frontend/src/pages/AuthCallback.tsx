// pages/auth/callback.tsx
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const { token } = router.query

        if (token && typeof token === 'string') {
            // Сохраняем токен
            localStorage.setItem('token', token)

            // Перенаправляем на главную
            router.push('/')
        }
    }, [router])

    return <div>Авторизация...</div>
}