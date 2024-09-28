import { useState } from "react";

export default function ThirdMain({ name }) {
  const [goalDuration, setGoalDuration] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      console.log("Duration submitted:", goalDuration);
    }
  };

  return (
    <div className="border-black border-8 rounded-xl grid items-center justify-items-center min-h-screen relative p-8 bg-[#FFF3E6]">
      <div className="font-pixelify text-8xl text-black flex items-center">
        <h1>Hello, {name}</h1>
        <img src="/images/smileChat.png" alt="smile" className="ml-2" />
      </div>

      <p className="font-pixelify text-center text-2xl text-black mt-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac est id
        odio eleifend elementum. Maecenas egestas euismod erat.
      </p>

      <div className="relative mt-10">
        <img
          src="/images/calendarHeart.png"
          alt="Calendar Heart"
          className="mx-auto"
        />

        <div className="box bg-white border-black border-8 rounded-md shadow-md px-12 py-4 inline-block text-center mt-4">
          <p className="font-pixelify text-lg text-black mb-4">
            Sounds good! How long do you want to achieve this goal? (Such as
            #days, #weeks, #months, etc)
          </p>

          <textarea
            className="text-black text-lg font-pixelify text-center outline-none py-2 px-4 resize-none rounded-md w-full h-20"
            placeholder="Enter your goal duration here..."
            value={goalDuration}
            onChange={(e) => setGoalDuration(e.target.value)}
            onKeyDown={handleKeyDown} // Submit the form with Enter key
          />
        </div>
      </div>

      <div className="absolute bottom-0 w-full flex justify-between px-10">
        <img
          src="/images/tree.png"
          alt="Tree"
          className="w-16 h-auto"
        />
        <img
          src="/images/tree.png"
          alt="Tree"
          className="w-16 h-auto"
        />
      </div>

      <div className="absolute right-0 top-16">
        <img src="/images/bird.png" alt="Bird" />
      </div>
    </div>
  );
}
