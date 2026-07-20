import React, { ChangeEvent, useState } from 'react';

function TextForm() {

  // 1. Declare state to hold the textbox value
  const [inputValue, setInputValue] = useState('');
  
  // 2. Declare state to display the submitted text
  const [submittedValue, setSubmittedValue] = useState('');

  // 3. Update state as the user types
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 4. Handle button click / form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedValue(inputValue);
    setInputValue(''); // Clear the textbox after clicking
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type something here..."
            />
            <button type='submit'>
                Submit
            </button>
        </form>

        {submittedValue && (<p>You submitted: {submittedValue}</p>)}
    </div>
  );
}

export default TextForm