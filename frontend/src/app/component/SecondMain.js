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
  
      <div className="relative">
      </div>
      
      <div className="font-pixelify text-8xl text-black flex items-center ">
        <h1>Hello, {name}</h1>
        <img src="/images/smileChat.png" alt="smile" className="ml-2" />
      </div>

      <div className="box bg-white border-black border-8 rounded-md shadow-md px-80 py-8 inline-block text-center relative">
        <img
          src="/images/plantGrowth.png"
          className="absolute top-[-90px] left-1/2 transform -translate-x-1/2"
          alt="Plant Growth"
        />
        <textarea
          className="text-black text-lg font-pixelify text-center outline-none py-2 px-14 resize-none rounded-md w-full h-32"
          placeholder="Let me know what kind of aspect you want to improve yourself?"
          value={textareaInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown} 
        />
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

