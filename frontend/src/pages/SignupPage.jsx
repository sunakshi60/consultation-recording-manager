import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function SignupPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("astrologer");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/signup", { name, email, password, role });
            localStorage.setItem("user", JSON.stringify(res.data));
            window.dispatchEvent(new Event("authChange"));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="glass-card p-10 w-full max-w-md animate-fade-in border border-white/5">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
                    <p className="text-white/40 text-sm">Join the consultation network</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-xs italic mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2 ml-1">Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full glass border border-white/10 p-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2 ml-1">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="john@example.com"
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

                    <div>
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2 ml-1">Role</label>
                        <select
                            className="w-full glass border border-white/10 p-4 rounded-xl text-white/60 focus:outline-none focus:border-indigo-500/50 transition-all"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="astrologer">Astrologer</option>
                            <option value="admin">Admin</option>
                            <option value="member">Member (Client)</option>
                        </select>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Register Account"}
                    </button>

                    <p className="text-center text-white/30 text-sm mt-8">
                        Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">Log in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;
