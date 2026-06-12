import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("user", JSON.stringify(res.data));
            window.dispatchEvent(new Event("authChange"));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="glass-card p-10 w-full max-w-md animate-fade-in border border-white/5">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
                    <p className="text-white/40 text-sm">Log in to manage your recordings</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-xs italic mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2 ml-1">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="astrologer@humarapandit.com"
                            className="w-full glass border border-white/10 p-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2 ml-1">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            className="w-full glass border border-white/10 p-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Login to Account"}
                    </button>

                    <p className="text-center text-white/30 text-sm mt-8">
                        Don't have an account? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">Sign up here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
