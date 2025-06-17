"use client"
import { useState } from "react"
import { useRegister, useLogin } from "@/utils/apiFunctions"
import { useAuthStore } from "@/store/AuthStore"
import { useRouter } from "next/navigation"

export default function AuthPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isLogin, setIsLogin] = useState(true)
    const router = useRouter()
    const { isAuthenticated } = useAuthStore()

    const { register, error: registerError, loading: registerLoading } = useRegister()
    const { login, error: loginError, loading: loginLoading } = useLogin()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            if (isLogin) {
                await login(email, password)
            } else {
                await register(username, email, password)
            }
        } catch (error) {
            console.error('Erreur lors de l\'authentification:', error)
        }
    }

    if (isAuthenticated) {
        router.push("/")
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            {(registerError || loginError) && (
                <p className="text-red-500">{registerError || loginError}</p>
            )}
            {!loginLoading && !registerLoading && (
                <div className="flex flex-col gap-4 items-center justify-center rounded-lg p-10 bg-secondary/10">
                    <h1 className="text-4xl font-bold">{isLogin ? "Login" : "Register"}</h1>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="input input-bordered rounded-full w-fit px-5 py-1 bg-secondary/10 border-1 border-secondary/30"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </>
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered rounded-full w-fit px-5 py-1 bg-secondary/10 border-1 border-secondary/30"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input input-bordered rounded-full w-fit px-5 py-1 bg-secondary/10 border-1 border-secondary/30"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary rounded-full bg-secondary text-black px-3 py-1 hover:bg-secondary/80 hover:scale-105 active:scale-95 transition-all duration-300">Submit</button>
                    </form>
                    <button onClick={() => setIsLogin(!isLogin)} className="text-sm">
                        {isLogin ? "I don't have an account, register" : "I have an account, login"}
                    </button>
                </div>
            )}
        </div>
    )
}