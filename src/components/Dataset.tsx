import { useState, useEffect, useCallback } from 'react';

interface Dataset {
    Id: string;
    Name: string;
    Description: string;
    Skill: string;
    Filters: string;
}

export default function Dataset() {
    // an array for the list of datasets
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    // inputs form
    const [idInput, setIdInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [filtersInput, setFiltersInput] = useState("");

    // delete
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // status checks
    const [loading, setLoading] = useState(false);
    const [addStatus, setAddStatus] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [validation, setValidation] = useState({
        id: "",
        name: "",
        description: "",
        skill: "",
        id_length: "",
        filters: "",
    });

    // Cleaning filters
    const cleanFilters = (value: String) =>
        value
            .split(",") // breaks the string into pieces at every comma
            .map((f) => f.trim()) // removes the spaces from the start and end of each piece
            .filter(Boolean) // throws away empty items
            .join(", "); // glues the pieces back into one string

    // Validation
    const validate = () => {
        let tempErrors = {id: "", name: "", description: "", skill: "", filters: "", id_length: ""};
        let isValid = true;
        
        if (!idInput) { tempErrors.id = "ID is required."; isValid = false; }
        if (!nameInput) { tempErrors.name = "Name is required."; isValid = false; }
        if (!descriptionInput) { tempErrors.description = "Description is required."; isValid = false; }
        if (!skillInput) { tempErrors.skill = "Skill is required."; isValid = false; }
        if (!filtersInput) {tempErrors.filters = "Filters is required."; isValid = false; }

        if (idInput && idInput.length !== 13) {
            tempErrors.id_length = "Dataset id must have 13 characters.";
            isValid = false;
        }

        setValidation(tempErrors);
        return isValid;
    } 

    // GET API
    const getDatasets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/dataset`);

            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }
            const result = await response.json();
            setDatasets(result);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getDatasets();
    }, [getDatasets]);

    // POST API
    const handleAdd = async () => {
        if (!validate()) return; // only checks when the user actually tries to submit
        setAddStatus(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/dataset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({Id: idInput, Name: nameInput, Description: descriptionInput, Skill: skillInput, Filters: cleanFilters(filtersInput)}),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                setError(result.message);
                return;
            } 
            // Reset every input
            setMessage(result.message);
            setError(null);
            setIdInput("");
            setNameInput("");
            setDescriptionInput("");
            setSkillInput("");
            setFiltersInput("");
            setTimeout(() => setMessage(""), 2000);
            await getDatasets();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAddStatus(false);
        }
    };

    // DELETE API
    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/dataset?id=${encodeURIComponent(id)}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
                setError(result.message);
                return;
            } 
            setMessage(result.message);
            setError(null);
            await getDatasets();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (dataset: Dataset) => {
        setIsEditMode(true);
        setIdInput(dataset.Id);
        setNameInput(dataset.Name);
        setDescriptionInput(dataset.Description);
        setSkillInput(dataset.Skill);
        setFiltersInput(dataset.Filters);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setIdInput("");
        setNameInput("");
        setDescriptionInput("");
        setSkillInput("");
        setFiltersInput("");
        setValidation({id: "", name: "", description: "", skill: "", id_length: "", filters: ""});
    }

    // UPDATE API
    const handleUpdate = async () => {
        if (!validate()) return; // bail if invalid
        setUpdating(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/dataset`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: idInput, 
                    Name: nameInput, 
                    Description: descriptionInput, 
                    Skill: skillInput,
                    Filters: cleanFilters(filtersInput),
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const updatedResult = await response.json();
            if (!updatedResult.success) {
                setError(updatedResult.message);
                return;
            }

            setMessage(updatedResult.message);
            setError(null);
            handleCancelEdit(); // closes modal + resets fields
            setTimeout(() => setMessage(""), 2000);
            await getDatasets();
        } catch (err: any){
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    }

    // Input Form
    return (
        <div className='max-w-3xl mx-auto p-6 border border-gray-200 rounded-lg shadow-sm'>
            <h2 className='text-center text-xl font-bold mb-4 text-gray-800'>My Datasets List</h2>
            <div className='text-center'>
                {loading && <p>Loading datasets...</p>}
                {error && <p className='text-red-600'>{error}</p>}
                {message && <p className='text-green-600'>{message}</p>}
            </div>

            <div className='flex flex-col gap-2 mb-4'>
                <label htmlFor='id'>Dataset Id:</label>
                <input 
                    id='id'
                    type='text'
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value)}
                    placeholder='Type dataset id...'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                {validation.id && <p className='text-red-500'>{validation.id}</p>}
                {validation.id_length && <p className='text-red-500'>{validation.id_length}</p>}
                <label htmlFor='name'>Dataset Name:</label>
                <input
                    id='name'
                    type='text'
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder='Type dataset name...'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                {validation.name && <p className='text-red-500'>{validation.name}</p>}
                <label htmlFor='description'>Dataset Description:</label>
                <input
                    id='description'
                    type='text'
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    placeholder='Type dataset description...'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                {validation.description && <p className='text-red-500'>{validation.description}</p>}
                <label htmlFor='skill'>Dataset Skill:</label>
                <textarea  
                    id='skill'
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    rows={8}
                    placeholder='Type dataset skill...'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                {validation.skill && <p className='text-red-500'>{validation.skill}</p>}
                <label htmlFor='filters'>Dataset Filters:</label>
                <input
                    id='filters'
                    type='text'
                    value={filtersInput}
                    onChange={(e) => setFiltersInput(e.target.value)}
                    placeholder='Year, Age, Area, Gender'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                {validation.filters && <p className='text-red-500'>{validation.filters}</p>}
                <button
                    className="px-4 py-2 border border-blue-300 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                    onClick={handleAdd} disabled={addStatus}
                >   
                {addStatus ? 'Adding...' : 'Add' }
                </button>
            </div>

            {/* Results section */}
            <h4 className='mb-4'>Results:</h4>
            <div className='space-y-2'>
                {datasets.map((dataset) => (
                    <p 
                        key={dataset.Id}
                        className='px-3 py-2 bg-gray-50 border border-gray-100 rounded-md text-gray-700'
                    >
                        <span className='font-bold'>Id:</span> {dataset.Id} <br />
                        <span className='font-bold'>Name:</span> {dataset.Name} <br />
                        <div className='flex gap-2 my-4'>
                            <button className="mx-2 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white font-medium transition-colors"
                            onClick={() => handleEdit(dataset)}
                            >Update</button>
                            <button 
                            className="mx-2 px-3 py-1 bg-red-400 hover:bg-red-500 text-white font-medium transition-colors"
                            onClick={() => handleDelete(dataset.Id)}
                            disabled={deletingId === dataset.Id}
                            >{deletingId === dataset.Id ? 'Deleting' : 'Delete'}</button>
                        </div>
                    </p>
                ))}
            </div>

            {/* Modal Edit Form */}
            {isEditMode && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg w-full max-w-md shadow-lg'>
                        <h3 className='text-lg font-bold mb-4'>Edit Dataset</h3>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor='edit-id'>Dataset Id:</label>
                            <input
                                id='edit-id'
                                type='text'
                                value={idInput}
                                disabled
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100'
                            />

                            <label htmlFor='edit-name'>Dataset Name:</label>
                            <input
                                id='edit-name'
                                type='text'
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            {validation.name && <p className='text-red-500'>{validation.name}</p>}

                            <label htmlFor='edit-description'>Dataset Description:</label>
                            <input
                                id='edit-description'
                                type='text'
                                value={descriptionInput}
                                onChange={(e) => setDescriptionInput(e.target.value)}
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            {validation.description && <p className='text-red-500'>{validation.description}</p>}

                            <label htmlFor='edit-skill'>Dataset Skill:</label>
                            <textarea
                                id='edit-skill'
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                rows={6}
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            {validation.skill && <p className='text-red-500'>{validation.skill}</p>}
                             <label htmlFor='filters'>Dataset Filters:</label>
                            <input
                                id='filters'
                                type='text'
                                value={filtersInput}
                                onChange={(e) => setFiltersInput(e.target.value)}
                                placeholder='Year, Age, Area, Gender'
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                            {validation.filters && <p className='text-red-500'>{validation.filters}</p>}
                        </div>

                        <div className='flex gap-2 mt-4 justify-end'>
                            <button
                                onClick={handleCancelEdit}
                                className='px-4 py-2 border border-gray-300 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors'>
                                    Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className='px-4 py-2 border border-blue-300 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors'>
                                    {updating ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
