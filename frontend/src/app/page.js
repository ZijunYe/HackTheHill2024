
"use client";
import { useState } from "react";
import SecondMain from './component/SecondMain';
import ThirdMain from './component/ThirdMain';
import GeneratingPlan from './component/GeneratingPlan'; // Import the GeneratingPlan component

export default function Home() {
  const [step, setStep] = useState(0); // Step state to track the current view
  const [name, setName] = useState(""); // State to store the user's name
  const [textareaInput, setTextareaInput] = useState(""); // State to store the textarea input from SecondMain
  const [goalDuration, setGoalDuration] = useState(""); // State to store the goal duration from ThirdMain
  const [difficultyLevel, setDifficulty] = useState(""); // State to store the goal duration from ThirdMain


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

  // Handle submission from ThirdMain (goal duration) (Third Step)
  const handleThirdMainSubmit = (duration,difficulty) => {
    setGoalDuration(duration);
    setDifficulty(difficulty);  // Save goal duration
    setStep(3); // Move to GeneratingPlan step
  };
  return (
    <div className="bg-[#FFF3E6] max-h-screen">
      
      {/* Step 0: Name input */}
      {step === 0 && (
        <div className="border-black border-8 rounded-xl grid p-64 items-center justify-items-center max-h-screen">
          <div className="relative flex items-center justify-center animate-moveIn">
            <img className="w-96 h-96 absolute z-10" src="/images/Ellipse.svg" alt="Ellipse" />
            <img className="w-80 h-80 relative z-20" src="/images/mountain.gif" alt="Mountain" />
          </div>

          <div className="flex flex-row">
          <h1 className="font-pixelify text-8xl sm:text-8xl text-center text-black pt-10">
            PAWGRESS
          </h1>
          <img
            src="/images/paw.png"
            className="w-24 h-24 mt-10 ml-4" // Adjust size and margin as needed
            alt="Paw"
          />
          </div>
    

          <div className="flex flex-col items-center pt-10">  
              <input
                type="text"
                name="username"
                placeholder="Start with your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={` font-mono border-8 border-white rounded-xl px-28 py-5 text-lg focus:outline-none shadow-md focus:ring-2 focus:ring-black placeholder:font-pixelify placeholder:text-white placeholder:font-5xl text-center ${
                  name ? 'bg-white text-black' : 'bg-black text-white'
                }`}
                onKeyDown={handleNameSubmit} // Handle "Enter" to submit the name
              />
            <div className="w-20 h-20 pt-4 animate-bounce cursor-pointer">
              <img className="w-64 h-auto" src="/images/cursor.png" alt="Cursor" />
            </div>
          </div>
          <div className="absolute bottom-0 w-full flex px-10 animate-moveIn">
            {/* <img  className="w-28 h-auto" src="/images/doggy.gif"></img> */}
            <img className="w-40 pt-10 animate-move-loop" src="/images/moving/rabbit_walking.gif"></img>
        </div>
          
        </div>
      )}

      {/* Step 1: SecondMain */}
      {step === 1 && <SecondMain name={name} onSubmit={handleSecondMainSubmit} />}

      {/* Step 2: ThirdMain */}
      {step === 2 && (
        <ThirdMain
          name={name}
          textareaInput={textareaInput}
          onSubmit={handleThirdMainSubmit} // Pass the submit handler for ThirdMain
        />
      )}

      {/* Step 3: GeneratingPlan */}
      {step === 3 && <GeneratingPlan name={name} goal={textareaInput} duration={goalDuration} difficulty={difficultyLevel} />} {/* Pass the name to GeneratingPlan */}
    </div>
  );
}


