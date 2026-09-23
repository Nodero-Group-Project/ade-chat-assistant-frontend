import { useCallback, useEffect, useState } from 'react';

interface Intent {
    Description: string;
}

export default function Admin() {
    // an array for the list of intents
    const [intents, setIntents] = useState<Intent[]>([]);
    // a string for the new intent input value
    const [newIntent, setNewIntent] = useState("");
    // error messages
    const [errorMsg, setErrorMsg] = useState("");
    // a loading boolean to check if an intent is being deleted
    const [loading, setLoading] = useState(false);
    const [deletingDescription, setDeletingDescription] = useState<string | null>(null)

    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error) return error.message;
        if (error && typeof error === 'object' && 'message' in error) return String(error.message);
        if (typeof error === 'string') return error;
        return "An unknown error occurred.";
    };

    const refreshIntents = useCallback(async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/intent`);

                if (!response.ok) {
                    throw new Error(`HTTP error. Status: ${response.status}`);
                }

                const result = await response.json();
                setIntents(result);
            } catch (err) {
                setErrorMsg(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        }, []);
        
    useEffect(() => {
        refreshIntents();
    }, [refreshIntents]);

    const handleAddClick = async () => {
        if (!newIntent.trim()) return; // Don't add empty strings
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
                setErrorMsg(result.message);
                return;
            }
            
            setErrorMsg("");
            setNewIntent('');
            await refreshIntents();
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } 
    };

    const handleDeleteClick = async (description: string) => {
        setDeletingDescription(description);
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
                setErrorMsg(result.message);
                return;
            }
            setErrorMsg("");
            await refreshIntents();
        } catch (err) {
            setErrorMsg(getErrorMessage(err));
        } finally {
            setDeletingDescription(null);
        }
    };

    return (
        <div>
            {loading && <p>Loading intents...</p>}
            {errorMsg && <p style={{color: 'red'}}>{errorMsg}</p>}
            
            <input 
                type="text"
                value={newIntent}
                onChange={(e) => setNewIntent(e.target.value)}
                placeholder="Type your new intent"
            />

            <button className="primary-btn" onClick={handleAddClick}>Add</button>

            
            <ul>
                {intents.map((intent) => (
                    <li key={intent.Description}>
                        {intent.Description}
                        <button
                            style={{marginLeft: '5px'}}
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
