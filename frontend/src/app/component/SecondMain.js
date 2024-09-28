import { useState } from "react";

export default function SecondMain({ name, onSubmit }) {
  const [textareaInput, setTextareaInput] = useState(""); // State to track textarea input

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      onSubmit(textareaInput); 
    }
  };

  const handleChange = (e) => {
    setTextareaInput(e.target.value); 
  };

  return (
    <div className="border-black border-8 rounded-xl grid items-center justify-items-center min-h-screen relative p-8">
      <div className="font-pixelify text-8xl text-black flex items-center">
        <h1>Hello, {name}</h1>
        <img src="/images/smileChat.png" alt="smile" className="ml-2" />
      </div>

      <div className="relative mt-10">
        <div className="box bg-white border-black border-8 rounded-md shadow-md px-44 py-8 inline-block text-center">
          <img
            src="/images/plantGrowth.png"
            className="absolute top-[-90px] left-1/2 transform -translate-x-1/2"
            alt="Plant Growth"
          />
          <textarea
            className="text-black text-lg font-pixelify text-center outline-none py-2 px-4 resize-none rounded-md w-full h-32"
            placeholder="Let me know what kind of aspect you want to improve yourself?"
            value={textareaInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown} 
          />
        </div>
      </div>

      <div>
        <img
          src="/images/cactus.png"
          alt="Cactus"
          className="absolute bottom-0 left-24 w-36"
        />
        <img
          src="/images/cactus.png"
          alt="Cactus"
          className="absolute bottom-0 right-24 w-36"
        />
      </div>
    </div>
  );
}

