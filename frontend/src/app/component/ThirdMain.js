import { useState } from "react";

export default function ThirdMain({ name, textareaInput }) {
  const [goalDuration, setGoalDuration] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      console.log("Goal duration submitted:", goalDuration);
    }
  };

  return (
    <div className="border-black border-8 rounded-xl grid items-center justify-items-center min-h-screen relative p-8 bg-[#FFF3E6]">

        <div className="relative mb-44">
            
        </div>
      <div className="font-pixelify text-8xl text-black flex items-center ">
        <h1>Hello, {name}</h1>
        <img src="/images/smileChat.png" alt="smile" className="ml-2" />
      </div>
      <div className="font-pixelify text-center text-2xl text-black ">
        {textareaInput} 
      </div>
      <div className="relative mb-44">
        <img
          src="/images/calendar.png"
          alt="Calendar Heart"
          className="mx-auto"/>
        
         <div className="box bg-white border-black border-8 rounded-md shadow-md px-44 py-8 inline-block text-center mb-20">
            <p className="font-pixelify text-lg text-black mb-4">
                Sounds good! How long do you want to achieve this goal? (Such as
                #days, #weeks, #months, etc)
            </p>

            <textarea
                className="text-black text-lg font-pixelify text-center outline-none py-2 px-4 resize-none rounded-md w-full h-20"
                placeholder="Enter your goal duration here..."
                value={goalDuration}
                onChange={(e) => setGoalDuration(e.target.value)}
                onKeyDown={handleKeyDown} // Handle "Enter" key to submit goal duration
            />
            </div>
      </div>

      <div className="absolute bottom-0 w-full flex justify-between px-10">
         <div className="flex space-x-2">
            {Array(3)
            .fill(null)
            .map((_, index) => (
                <img
                key={`left-tree-${index}`}
                src="/images/Tree.png"
                alt="Tree"
                className="w-28 h-auto"
                />
            ))}
        </div>

        {/* Right side with 3 repeated trees */}
        <div className="flex space-x-2">
            {Array(3)
            .fill(null)
            .map((_, index) => (
                <img
                key={`right-tree-${index}`}
                src="/images/Tree.png"
                alt="Tree"
                className="w-28 h-auto"
                />
            ))}
        </div>
        </div>

      <div className="absolute right-0 top-16">
        <img src="/images/bird.gif" alt="Bird" />
      </div>
    </div>
  );
}
