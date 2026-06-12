import { Link } from "react-router-dom";

function RecordingCard({ recording }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="glass-card p-5 group animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <h2 className="font-bold text-xl text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {recording.title}
                </h2>
                <span className="text-[10px] uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md text-white/40">
                    {recording.fileType.split('/')[1]?.toUpperCase() || 'AUDIO'}
                </span>
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-white/60">
                    <span className="w-20 font-medium">Client:</span>
                    <span className="text-white/90">{recording.clientName}</span>
                </div>
                <div className="flex items-center text-sm text-white/60">
                    <span className="w-20 font-medium">Consultant:</span>
                    <span className="text-white/90">{recording.consultantName}</span>
                </div>
                <div className="flex items-center text-sm text-white/60">
                    <span className="w-20 font-medium">Date:</span>
                    <span className="text-white/90">{formatDate(recording.consultationDate)}</span>
                </div>
            </div>

            <Link
                to={`/recording/${recording._id}`}
                className="w-full flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all border border-white/5"
            >
                View Details
            </Link>
        </div>
    );
}

export default RecordingCard;