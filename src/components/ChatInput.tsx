import React, { ChangeEvent } from 'react';
import {useState, useEffect} from 'react';
export function ChatInput() {

  // 1. Declare state to hold the textbox value
  const [inputValue, setInputValue] = useState('');
  
  // 2. Declare state to display the submitted text
  const [submittedValue, setSubmittedValue] = useState('');

  // 3. Update state as the user types
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 4. Handle button click / form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedValue(inputValue);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/report?question=${encodeURIComponent(inputValue)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      console.log(data);
      
    } catch (error) {
      console.error(error);
    }

    setInputValue(''); // Clear the textbox after clicking
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Ask a question"
            />
            <button type='submit'>
                Search
            </button>
        </form>

        {/* If there is value in the submittedValue then show the user's question */}
        {submittedValue && (<p>Question: <br></br> {submittedValue}</p>)}
    </div>
  );
}

export default ChatInput