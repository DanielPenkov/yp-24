import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export function AlertModal({type, message , onClose}: {type: 'success' | 'error', message: string, onClose: () => void}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
                <div className="flex items-center justify-center mb-4">
                    {type === 'success' ? (
                        <CheckCircleIcon className="h-12 w-12 text-green-500" />
                    ) : (
                        <ExclamationCircleIcon className="h-12 w-12 text-red-500" />
                    )}
                </div>
                <div className={`text-center ${type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    <h2 className="text-2xl font-bold mb-2">
                        {type === 'success' ? 'Success!' : 'Error'}
                    </h2>
                    <p className="text-sm">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    Close
                </button>
            </div>
        </div>
    );
}