import ReactPlayer from "react-player";
import CloseIcon from "@mui/icons-material/Close";

const VideoModal = ({ videoUrl, isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.id === "video-modal-overlay") onClose();
    };

    return (
        <div
            id="video-modal-overlay"
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full mx-4 sm:mx-8">
                <div className="w-full aspect-video">
                    <ReactPlayer url={videoUrl} width="100%" height="100%" controls />
                </div>
                <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6"
                    onClick={onClose}
                    aria-label="Fechar"
                >
                    <div className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full cursor-pointer shadow-md">
                        <CloseIcon style={{ fontSize: 30, color: "#333" }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;
