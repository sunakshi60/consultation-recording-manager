import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function RecordingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recording, setRecording] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadRecording();
    }, [id]);

    const loadRecording = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/recordings/${id}`);
            setRecording(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this recording?")) return;

        try {
            setDeleting(true);
            await api.delete(`/recordings/${id}`);
            navigate("/");
        } catch (error) {
            alert("Failed to delete");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!recording) return (
        <div className="max-w-4xl mx-auto p-20 text-center">
            <h2 className="text-2xl text-white/40 italic">Recording not found.</h2>
        </div>
    );

    const isVideo = recording.fileType?.startsWith('video');

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                <div className="lg:col-span-2 space-y-8">
                    <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                        <div className="p-2">
                            {isVideo ? (
                                <video
                                    className="w-full rounded-2xl aspect-video bg-black/40"
                                    controls
                                    src={recording.fileUrl.startsWith('http') ? recording.fileUrl : `http://localhost:5000/uploads/${recording.fileUrl}`}
                                />
                            ) : (
                                <div className="p-10 flex flex-col items-center justify-center bg-indigo-500/5 rounded-2xl border border-white/5">
                                    <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-10 h-10 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                                        </svg>
                                    </div>
                                    <audio
                                        className="w-full mt-4"
                                        controls
                                        src={recording.fileUrl.startsWith('http') ? recording.fileUrl : `http://localhost:5000/uploads/${recording.fileUrl}`}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="p-8 border-t border-white/5">
                            <h1 className="text-3xl font-black text-white mb-4 line-clamp-2 leading-tight">
                                {recording.title}
                            </h1>
                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white/30 mb-2">Consultation Notes</h3>
                                <p className="text-white/70 leading-relaxed italic bg-white/5 p-6 rounded-2xl border border-white/5">
                                    {recording.notes || "No notes provided for this consultation."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass rounded-3xl p-8 border border-white/5 space-y-6">
                        <div className="space-y-4 pb-6 border-b border-white/5">
                            <div>
                                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 pb-1 block font-mono">Client</label>
                                <p className="text-lg font-bold text-white truncate">{recording.clientName}</p>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 pb-1 block font-mono">Consultant</label>
                                <p className="text-lg font-bold text-white truncate">{recording.consultantName}</p>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 pb-1 block font-mono">Date</label>
                                <p className="text-lg font-bold text-white">{new Date(recording.consultationDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <a
                                href={recording.fileUrl.startsWith('http') ? recording.fileUrl : `http://localhost:5000/uploads/${recording.fileUrl}`}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex justify-center items-center gap-3 bg-white hover:bg-white/90 text-slate-900 py-4 rounded-2xl transition-all font-bold shadow-xl shadow-white/5"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download File
                            </a>

                            {user?.role === "admin" && (
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="w-full text-red-400/60 hover:text-red-400 hover:bg-red-400/5 py-4 rounded-2xl transition-all text-sm font-semibold tracking-wide border border-transparent hover:border-red-500/20"
                                >
                                    {deleting ? "Deleting..." : "Delete Recording"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-6 border border-white/5">
                        <h4 className="text-xs font-bold text-white/40 uppercase mb-3">File Info</h4>
                        <div className="flex justify-between text-xs font-mono text-white/30">
                            <span>Format:</span>
                            <span className="text-indigo-400 uppercase">{recording.fileType.split('/')[1]}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecordingDetails;