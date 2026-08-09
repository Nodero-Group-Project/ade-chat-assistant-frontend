import React, { ChangeEvent } from 'react';
import {useState, useEffect} from 'react';
export function ChatInput() {

  // Declare state to hold the textbox value/question
  const [inputValue, setInputValue] = useState('');
  
  // Declare state to display the submitted text/question
  const [submittedValue, setSubmittedValue] = useState('');

  // To store the results
  const [results, setResults] = useState<any>(null);

  // Update state as the user types
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle button click / form submission
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

      // Store the API response
      setResults(data);
      
    } catch (error) {
      console.error(error);
    }

    setInputValue(''); // Clear the textbox after clicking
  };

  return (
    <div>
        {/* Search */}
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
        {submittedValue && (
          <div>
            <p>
              <strong>Question:</strong> 
              <br /> 
              {submittedValue}
            </p>
          </div>
        )}


        {/* Results container */}
        {results && (
          <div className="results-container">
            <h2>Results</h2>
            <pre>
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
    </div>
  );
}

export default ChatInput