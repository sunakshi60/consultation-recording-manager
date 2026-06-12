import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        const handleAuthChange = () => {
            setUser(JSON.parse(localStorage.getItem("user")));
        };

        window.addEventListener("authChange", handleAuthChange);
        return () => window.removeEventListener("authChange", handleAuthChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/5 mb-8">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                <Link
                    to="/"
                    className="flex items-center gap-2 group"
                >
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                        <span className="text-white font-bold text-xl">H</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Humara Pandit
                    </span>
                </Link>

                <div className="flex gap-6 items-center">
                    <Link
                        to="/"
                        className="text-white/70 hover:text-white transition-colors font-medium text-sm"
                    >
                        Dashboard
                    </Link>

                    {user ? (
                        <>
                            {user.role === "astrologer" && (
                                <Link
                                    to="/upload"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-semibold text-sm"
                                >
                                    New Upload
                                </Link>
                            )}
                            {user.role === "admin" && (
                                <div className="bg-amber-500/10 border border-amber-500/50 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    Admin
                                </div>
                            )}
                            {user.role === "member" && (
                                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    Member
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-red-400 hover:text-red-300 transition-colors font-medium text-sm border-l border-white/10 pl-6"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <Link to="/login" className="text-white/70 hover:text-white font-medium text-sm">Login</Link>
                            <Link
                                to="/signup"
                                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl transition-all font-semibold text-sm border border-white/10"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;