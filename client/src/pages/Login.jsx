import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(formData);

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4">

            {/* Soft Backdrop */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute left-1/2 top-20 -translate-x-1/2 w-245 h-115 bg-linear-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />

                <div className="absolute right-12 bottom-10 w-105 h-55 bg-linear-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
            </div>

            <form
                onSubmit={handleSubmit}
                className="relative z-10 w-full max-w-87.5 text-center bg-white/5 border border-white/10 rounded-2xl px-8 backdrop-blur-xl"
            >
                <h1 className="text-white text-3xl mt-10 font-medium">
                    Login
                </h1>

                <p className="text-gray-400 text-sm mt-2">
                    Please sign in to continue
                </p>

                {error && (
                    <div className="mt-5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Email */}
                <div className="flex items-center w-full mt-6 bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-white/75"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email id"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                    />
                </div>

                {/* Password */}
                <div className="flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-indigo-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-white/75"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            width="18"
                            height="11"
                            x="3"
                            y="11"
                            rx="2"
                            ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        autoComplete="current-password"
                        className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none"
                    />
                </div>

                {/* Forgot password */}
                <div className="mt-4 text-left">
                    <button
                        type="button"
                        className="text-sm text-indigo-400 hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Login */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>

                {/* Register */}
                <p className="text-gray-400 text-sm mt-3 mb-11">
                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-indigo-400 hover:underline ml-1"
                    >
                        click here
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;