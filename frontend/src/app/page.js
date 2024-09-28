"use client";
import { useState } from "react";
import SecondMain from './component/SecondMain';
import ThirdMain from './component/ThirdMain';

export default function Home() {
  const [step, setStep] = useState(0); // Step state to track the current view
  const [name, setName] = useState(""); // State to store the user's name
  const [textareaInput, setTextareaInput] = useState(""); // State to store the textarea input from SecondMain

  // Handle when the user submits their name (First Step)
  const handleNameSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission behavior
      if (name.trim()) {
        setStep(1); // Move to the SecondMain step
      }
    }
  };

  // Handle submission from SecondMain (textarea input) (Second Step)
  const handleSecondMainSubmit = (input) => {
    setTextareaInput(input); // Save textarea input
    setStep(2); // Move to ThirdMain
  };

  return (
    <div className="bg-[#FFF3E6] min-h-screen">
      {step === 0 && (
        <div className="border-black border-8 rounded-xl grid p-64 items-center justify-items-center min-h-screen">
          <div className="relative flex items-center justify-center">
            <img className="w-96 h-96 absolute z-10" src="/images/Ellipse.svg" alt="Ellipse" />
            <img className="w-60 h-60 relative z-20" src="/images/mountain.gif" alt="Mountain" />
          </div>

          <h1 className="font-pixelify text-8xl sm:text-8xl text-center text-black pt-10">
            Self Improvement
          </h1>

          <div className="flex flex-col items-center pt-10">
            <input
              type="text"
              name="username"
              placeholder="Start with your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`border-8 border-white rounded-xl px-28 py-5 text-lg focus:outline-none shadow-md focus:ring-2 focus:ring-black placeholder:font-pixelify placeholder:text-white placeholder:font-5xl ${
                name ? 'bg-white text-black' : 'bg-black text-white'
              }`}
              onKeyDown={handleNameSubmit} // Handle "Enter" to submit the name
            />
            <div className="w-20 h-20 pt-4 animate-bounce cursor-pointer">
              <img className="w-64 h-auto" src="/images/cursor.png" alt="Cursor" />
            </div>
          </div>
        </div>
      )}

      {step === 1 && <SecondMain name={name} onSubmit={handleSecondMainSubmit} />}

      {step === 2 && <ThirdMain name={name} textareaInput={textareaInput} />}
    </div>
  );
}
