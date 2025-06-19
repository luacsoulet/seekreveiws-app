"use client"
import { useState } from "react"
import { useRegister, useLogin } from "@/utils/apiFunctions"
import { useAuthStore } from "@/store/AuthStore"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"

export default function AuthPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isLogin, setIsLogin] = useState(true)
    const router = useRouter()
    const { isAuthenticated } = useAuthStore()

    const { register, error: registerError, loading: registerLoading, fieldErrors: registerFieldErrors, authError: registerAuthError } = useRegister()
    const { login, error: loginError, loading: loginLoading, fieldErrors: loginFieldErrors, authError: loginAuthError } = useLogin()

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

    let authError = isLogin ? loginAuthError : registerAuthError;

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            {!loginLoading && !registerLoading && (
                <div className="flex flex-col gap-4 items-center justify-center rounded-lg p-10 bg-secondary/10">
                    <h1 className="text-4xl font-bold">{isLogin ? "Login" : "Register"}</h1>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <div className="flex flex-col w-full">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className={`bg-secondary/10 rounded-full px-5 py-2 focus:outline-none focus:ring-2 ${registerFieldErrors?.username ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    {registerFieldErrors?.username && (
                                        <span className="text-red-400 text-sm mt-1 ml-3 flex items-center">
                                            <AlertCircle size={14} className="mr-1" /> {registerFieldErrors.username}
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="flex flex-col w-full">
                            <input
                                type="email"
                                placeholder="Email"
                                className={`bg-secondary/10 rounded-full px-5 py-2 focus:outline-none focus:ring-2 ${(isLogin ? loginFieldErrors?.email : registerFieldErrors?.email) ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {isLogin && loginFieldErrors?.email && (
                                <span className="text-red-400 text-sm mt-1 ml-3 flex items-center">
                                    <AlertCircle size={14} className="mr-1" /> {loginFieldErrors.email}
                                </span>
                            )}
                            {!isLogin && registerFieldErrors?.email && (
                                <span className="text-red-400 text-sm mt-1 ml-3 flex items-center">
                                    <AlertCircle size={14} className="mr-1" /> {registerFieldErrors.email}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col w-full">
                            <input
                                type="password"
                                placeholder="Password"
                                className={`bg-secondary/10 rounded-full px-5 py-2 focus:outline-none focus:ring-2 ${(isLogin ? loginFieldErrors?.password : registerFieldErrors?.password) ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {isLogin && loginFieldErrors?.password && (
                                <span className="text-red-400 text-sm mt-1 ml-3 flex items-center">
                                    <AlertCircle size={14} className="mr-1" /> {loginFieldErrors.password}
                                </span>
                            )}
                            {!isLogin && registerFieldErrors?.password && (
                                <span className="text-red-400 text-sm mt-1 ml-3 flex items-center">
                                    <AlertCircle size={14} className="mr-1" /> {registerFieldErrors.password}
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary rounded-full bg-secondary text-black px-3 py-2 hover:bg-secondary/80 hover:scale-105 active:scale-95 transition-all duration-300"
                        >
                            Submit
                        </button>
                    </form>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setUsername("");
                            setEmail("");
                            setPassword("");
                        }}
                        className="text-sm"
                    >
                        {isLogin ? "I don't have an account, register" : "I have an account, login"}
                    </button>
                </div>
            )}
            {loginLoading || registerLoading ? (
                <div className="flex items-center gap-2 bg-blue-500/20 text-blue-300 p-4 rounded-lg">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>{isLogin ? "Connecting..." : "Registering..."}</span>
                </div>
            ) : null}
            {(registerError || loginError) && (
                <p className="text-red-500 bg-red-500/10 rounded-lg p-4 text-lg flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    {registerError || loginError}
                </p>
            )}
            {authError && (
                <div className="text-amber-500 bg-amber-500/10 rounded-lg p-4 text-lg flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    <span>{authError}</span>
                </div>
            )}
        </div>
    )
}