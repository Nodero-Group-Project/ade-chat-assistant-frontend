import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast'

interface Intent {
    Description: string;
}

export default function Intent() {
    // an array for the list of intents
    const [intents, setIntents] = useState<Intent[]>([]);
    // a string for the new intent input value
    const [newIntent, setNewIntent] = useState("");
    // an adding boolean to check if an intent is being added
    const [adding, setAdding] = useState(false);
    const [deletingDescription, setDeletingDescription] = useState<string | null>(null)

    const refreshIntents = useCallback(async (silent = false) => {
        const request = (async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/intent`);
            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }
            return response.json();
        })();

        if(!silent) {
            toast.promise(request, {
                loading: 'Loading datasets...',
                success: 'Datasets are loaded!',
                error: 'Could not load datasets.',
            },
                { id: 'load-datasets'} // to prevent duplicate toasts for loading datasets
            );
        }

        try {
            const result = await request;
            setIntents(result);
            } catch (err: any) {
                if (silent) toast.error(err.message || "Could not refresh intents");
            }
    }, []);
        
    useEffect(() => {
        refreshIntents();
    }, [refreshIntents]);

    const handleAddClick = async () => {
        if (!newIntent.trim()) return; // Don't add empty strings
        setAdding(true);
        const toastId = toast.loading("Adding intent...");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({Description: newIntent}),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                toast.error(result.message, { id: toastId });
                return;
            }
            
            setNewIntent('');
            toast.success("Intent added!", { id: toastId });
            await refreshIntents(true);
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong.');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteClick = async (description: string) => {
        setDeletingDescription(description);
        const toastId = toast.loading("Deleting intent...")
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/intent?description=${encodeURIComponent(description)}`,
                { method: 'DELETE'}
            );

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                toast.error(result.message, { id: toastId });
                return;
            }
            toast.success(result.message, { id: toastId })
            await refreshIntents(true);
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong.');
        } finally {
            setDeletingDescription(null);
        }
    };

    return (
        <div className='max-w-md mx-auto my-8 p-6 border border-gray-200 rounded-lg shadow-sm'>
            <h2 className='text-center text-xl font-bold mb-4 text-gray-800'>My Intents List</h2>    
            <div className='flex gap-2 mb-4'>
                <input 
                    type="text"
                    value={newIntent}
                    onChange={(e) => setNewIntent(e.target.value)}
                    placeholder="Type your new intent"
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <button 
                    className="px-4 py-2 border border-blue-300 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium  transition-colors" 
                    onClick={handleAddClick} disabled={adding}>{adding ? 'Adding...' : 'Add'}</button>
            </div>
           
            <ul className='space-y-2'>
                {intents.map((intent) => (
                    <li 
                        className='flex items-center justify-between gap-4 px-3 py-2 bg-gray-50 border border-gray-100 rounded-md text-gray-700'
                        key={intent.Description}>
                        <span className='flex-1 min-w-0 break-words'>{intent.Description}</span>
                        <button
                            className="shrink-0 w-24 px-3 py-1 rounded-md bg-red-400 hover:bg-red-500 text-white font-medium transition-colors"
                            onClick={() => handleDeleteClick(intent.Description)}
                            disabled={deletingDescription === intent.Description}
                        >
                            {deletingDescription === intent.Description ? 'Deleting...' : 'Delete'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>        
    );
}
