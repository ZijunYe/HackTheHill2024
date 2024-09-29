"use client"; // Mark this as a client component

import { useState, useEffect } from 'react';

export default function Score() {
  const [score, setScore] = useState(null); // State to store the score
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(true); // State for loading state
  
  const fakeData = { score: 12 }; // Define fake data to be used in case of an error

  useEffect(() => {
    // Function to fetch score data
    const fetchScore = async () => {
      try {
        const response = await fetch('/api/score'); // Replace with your actual API URL
        if (!response.ok) {
          throw new Error('Failed to fetch score');
        }
        const data = await response.json();
        setScore(data.score); // Assuming the score is in the 'score' field of the response
      } catch (error) {
        console.error("Error fetching data, falling back to fake data:", error);
        setError(error.message);
        setScore(fakeData.score); // Set fake score if fetch fails
      } finally {
        setLoading(false); // Stop loading after the fetch attempt (whether successful or not)
      }
    };

    fetchScore(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array to ensure the fetch happens only once when the component mounts

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>; // Show a loading indicator
  }

  const scoreString = score !== null ? score.toString() : ''; // Make sure score is not null

  return (
    <div className="flex flex-col items-center ml-8 mt-2">
      <div className="pixelated text-black space-y-4">
        {/* Display the word "STREAK" vertically with custom size */}
        <div className="flex flex-col space-y-1 text-5xl"> {/* Change text size here */}
          {"STREAK".split('').map((letter, index) => (
            <div key={index}>{letter}</div>
          ))}
        </div>

        {/* Display the score digits vertically with custom size */}
        <div className="flex flex-col space-y-1 text-5xl"> {/* Change text size here */}
          {scoreString.split('').map((digit, index) => (
            <div key={index}>{digit}</div>
          ))}
        </div>
      </div>
    </div>
  );
}


