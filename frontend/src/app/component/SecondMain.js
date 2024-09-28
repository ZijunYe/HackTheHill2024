import { useState, useEffect } from "react";

export default function SecondMain({ name, onSubmit }) {
  const [textareaInput, setTextareaInput] = useState(""); // State to track textarea input
  const [leftVisibleTrees, setLeftVisibleTrees] = useState(0);
  const [rightVisibleTrees, setRightVisibleTrees] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      onSubmit(textareaInput); 
    }
  };

  const handleChange = (e) => {
    setTextareaInput(e.target.value); 
  };

  useEffect(() => {
    const leftTreeInterval = setInterval(() => {
      setLeftVisibleTrees((prev) => Math.min(prev + 1, 3));
    }, 500); // Adjust delay time as needed

    const rightTreeInterval = setInterval(() => {
      setRightVisibleTrees((prev) => Math.min(prev + 1, 3));
    }, 500); // Adjust delay time as needed

    return () => {
      clearInterval(leftTreeInterval);
      clearInterval(rightTreeInterval);
    };
  }, []);
  
  return (
    <div className="border-black border-8 rounded-xl grid items-center justify-items-center min-h-screen relative p-8">
      
      <div className="flex flex-col items-center justify-center animate-moveIn">
        <div className="font-pixelify text-8xl text-black flex items-center justify-center mb-12 ">
          <h1>Hello, {name}</h1>
          <img src="/images/smileChat.png" alt="smile" className="ml-2" />
        </div>

        <div className="box bg-white border-black border-8 rounded-md shadow-md px-32 py-8 inline-block text-center relative mt-8">
          <img
            src="/images/plantGrowth.png"
            className="absolute top-[-90px] left-1/2 transform -translate-x-1/2"
            alt="Plant Growth"
          />
          <textarea
            className="font-mono text-black text-2xl font-pixelify text-center outline-none py-2 px-4 resize-none rounded-md w-[600px] h-32"
            placeholder="Let me know what kind of aspect you want to improve yourself?"
            value={textareaInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown} 
          />
        </div>
      </div>



      <div className="absolute bottom-0 w-full flex justify-between px-10">
      {/* Left side trees */}
      <div className="flex space-x-2">
        {Array(leftVisibleTrees)
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

      {/* Right side trees */}
      <div className="flex space-x-2">
        {Array(rightVisibleTrees)
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

