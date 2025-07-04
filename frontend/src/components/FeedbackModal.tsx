import React from 'react';

interface FeedbackModalProps {
    message: string | null;
    error: string | null;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ message, error, onClose }) => {
    const show = !!message || !!error;

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold">
                        {message ? 'Успех' : 'Ошибка'}
                    </h5>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-xl"
                        aria-label="Закрыть"
                    >
                        &times;
                    </button>
                </div>

                <div className="mb-4">
                    {message && <p className="text-green-600">{message}</p>}
                    {error && <p className="text-red-600">{error}</p>}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-md ${
                            message
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;