"use client";
import { useState } from "react";
import SecondMain from './component/SecondMain'; 

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track form submission
  const [name, setName] = useState(""); // State to store the name

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission
      setIsSubmitted(true); // Change the state to submitted
      console.log("Form submitted with name:", e.target.value);
    }
  };
  return (
    <div className="bg-[#FFF3E6] max-h-screen">
      {!isSubmitted ? (
       
          <div className="border-black border-8 rounded-xl grid p-64 items-center justify-items-center min-h-screen">
            
            <div className="relative flex items-center justify-center">
              <img className="w-96 h-96 absolute z-10" src="/images/Ellipse.svg" alt="Ellipse" />
              <img className="w-60 h-60 relative z-20" src="/images/mountain.gif" alt="Mountain" />
            </div>

            <h1 className="font-pixelify text-8xl sm:text-8xl text-center text-black pt-10">
              Self Improvement
            </h1>

            <div className="flex flex-col items-center pt-10">
            <form className="flex flex-col items-center space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Start with ur name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`border-8 border-white rounded-xl px-28 py-5 text-lg focus:outline-none shadow-md focus:ring-2 focus:ring-black placeholder:font-pixelify placeholder:text-white placeholder:font-5xl ${
                  name ? 'bg-white text-black' : 'bg-black text-white'
                }`}
                onKeyDown={handleKeyDown}
              />
            </form>
              <div className="w-20 h-20 pt-4 animate-bounce cursor-pointer">
                <img className="w-64 h-auto" src="/images/cursor.png" alt="Cursor" />
              </div>
            </div>
          </div>
      ) : (
        <SecondMain name={name} /> // Use the Greeting component here
      )}
    </div>
  );
}
