import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UploadPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        consultantName: "",
        clientName: "",
        clientEmail: "",
        notes: "",
        consultationDate: "",
    });

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setError("Please select a recording file.");

        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) =>
                formData.append(key, form[key])
            );
            formData.append("file", file);

            await api.post("/recordings", formData);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload recording.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-3 text-white">New Consultation</h1>
                <p className="text-white/50">Details regarding the consultation and its recording.</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="glass rounded-3xl p-8 space-y-6 shadow-2xl border border-white/5"
            >
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm italic">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="group">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">Title</label>
                        <input
                            required
                            placeholder="e.g., Career Guidance Session"
                            className="w-full glass border border-white/10 p-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">Consultant</label>
                            <input
                                required
                                placeholder="Consultant Name"
                                className="w-full glass border border-white/10 p-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                                onChange={(e) => setForm({ ...form, consultantName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">Client Name</label>
                            <input
                                required
                                placeholder="Client Name"
                                className="w-full glass border border-white/10 p-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">Client Email</label>
                            <input
                                required
                                type="email"
                                placeholder="client@example.com"
                                className="w-full glass border border-white/10 p-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">Consultation Date</label>
                        <input
                            required
                            type="date"
                            className="w-full glass border border-white/10 p-4 rounded-xl text-white/60 focus:outline-none focus:border-indigo-500/50 transition-all"
                            onChange={(e) => setForm({ ...form, consultationDate: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">Consultation Notes</label>
                        <textarea
                            rows="4"
                            placeholder="Key discussion points..."
                            className="w-full glass border border-white/10 p-4 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-white/40 mb-2 ml-1">Recording File</label>
                        <div className="relative glass border border-dashed border-white/20 rounded-2xl p-8 hover:border-indigo-500/50 transition-all cursor-pointer group text-center">
                            <input
                                required
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <div className="space-y-2">
                                <svg className="w-10 h-10 text-white/20 mx-auto group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-white/60 font-medium">
                                    {file ? file.name : "Select Audio/Video Recording"}
                                </p>
                                <p className="text-white/20 text-xs">MP3, WAV, MP4 allowed</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                        </>
                    ) : "Complete Upload"}
                </button>
            </form>
        </div>
    );
}

export default UploadPage;