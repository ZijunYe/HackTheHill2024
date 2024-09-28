import { useState } from "react";

export default function ThirdMain({ name, textareaInput, onSubmit }) {
  const [goalDuration, setGoalDuration] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      console.log("Goal duration submitted:", goalDuration);

      // Call the onSubmit prop with the goal duration to move to the next step
      if (goalDuration.trim()) {
        onSubmit(goalDuration); // Pass goalDuration to parent
      }
    }
  };

  return (
    <div className="border-black border-8 rounded-xl grid items-center justify-items-center min-h-screen relative p-8">

    <div className="flex flex-col items-center justify-center">
    <div className="font-pixelify text-8xl text-black flex flex-col items-center justify-center mb-12">
        <h1 className="text-center">Sounds Interesting <br /> {name}!</h1>
        <img src="/images/smileChat.png" alt="smile" className="mt-4" />
      </div>


      <div className="font-pixelify text-center text-3xl text-black mb-10">
        Goal: {textareaInput}
      </div>


      <div className="relative mb-44">
        {/* <img src="/images/calendar.png" alt="Calendar Heart" className="mx-auto"/> */}
        <div className="box bg-white border-black border-8 rounded-md shadow-md px-32 py-8 inline-block text-center mb-20">
          <p className="font-pixelify text-2xl text-black mb-4">
            How long do you want to achieve this goal? (Such as
            #days, #weeks, #months, etc)
          </p>

          <textarea
            className="text-black text-2xl font-pixelify text-center outline-none py-2 px-4 resize-none rounded-md w-full h-20"
            placeholder="Enter your goal duration here..."
            value={goalDuration}
            onChange={(e) => setGoalDuration(e.target.value)}
            onKeyDown={handleKeyDown} // Handle "Enter" key to submit goal duration
          />
        </div>
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



     
    </div>
  );
}

