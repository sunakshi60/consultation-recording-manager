import { useEffect, useState } from "react";
import api from "../services/api";
import RecordingCard from "../components/RecordingCard";

function Dashboard() {
    const [recordings, setRecordings] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchRecordings();
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [search]);

    const fetchRecordings = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/recordings?search=${search}`);
            setRecordings(res.data);

            if (user?.role === "admin") {
                const statsRes = await api.get("/recordings/stats");
                setStats(statsRes.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const dashboardStats = user?.role === "admin" && stats ? [
        { label: "Total Astrologers", value: stats.totalUsers - 1 > 0 ? stats.totalUsers - 1 : 0 },
        { label: "Total Members", value: stats.totalClients },
        { label: "Total Consultations", value: stats.totalRecordings },
        { label: "Total Recordings", value: stats.totalRecordings }
    ] : user?.role === "member" ? [
        { label: "My Recordings", value: recordings.length },
        { label: "Consultation History", value: recordings.length },
        { label: "Last Session", value: recordings.length > 0 ? new Date(recordings[0].consultationDate).toLocaleDateString() : "N/A" }
    ] : [
        { label: "My Consultations", value: recordings.length },
        { label: "This Month", value: recordings.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length },
        { label: "My Clients", value: [...new Set(recordings.map(r => r.clientName))].length }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <header className="mb-12 animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black mb-2 text-white">Dashboard</h1>
                    <p className="text-white/50">Manage and organize your consultation history efficiently.</p>
                </div>

                {user && (
                    <div className="glass-card p-4 flex items-center gap-4 border border-white/10 min-w-[300px]">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-white text-sm">{user.name}</h3>
                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${user.role === "admin" ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <p className="text-white/30 text-[10px] font-mono">{user.email}</p>
                        </div>
                    </div>
                )}
            </header>

            =            <div className={`grid grid-cols-1 md:grid-cols-${dashboardStats.length} gap-6 mb-12`}>
                {dashboardStats.map((stat, idx) => (
                    <div key={idx} className="glass-card p-6">
                        <p className="text-white/50 text-sm font-medium mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="relative mb-10 group">
                <input
                    type="text"
                    placeholder="Search by title, client, or consultant..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full glass border border-white/10 p-5 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all pl-14"
                />
                <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {loading && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {recordings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recordings.map((recording) => (
                        <RecordingCard
                            key={recording._id}
                            recording={recording}
                        />
                    ))}
                </div>
            ) : !loading ? (
                <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-white/10">
                    <p className="text-white/40 text-lg">No recordings found matching your criteria.</p>
                </div>
            ) : null}
        </div>
    );
}

export default Dashboard;