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
      
      <div className="absolute inset-0 z-0">
      <div className="flex space-x-2">
      <img
          src="/images/cloud.gif"
          width={600}
          style={{ position: 'absolute', top: '50%', left: '15%', transform: 'translate(-50%, -50%)' }}
          alt="Cloud"
        />
      </div>
      <div className="flex space-x-2">
      <img
          src="/images/cloud.gif"
          width={600}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-15%',
            transform: 'translate(-50%, -50%) scaleX(-1)' // Added scaleX(-1) to flip horizontally
          }}
          alt="Cloud"
        />
      </div>
      </div>
      <div className="flex flex-col items-center justify-center animate-moveIn relative z-10 pt=20">
        <div className="font-pixelify text-8xl text-black flex items-center justify-center mb-24">
          <h1>Hello, {name}</h1>
          <img
        src="/images/smileChat.png"
        alt="smile"
        className="bobbing ml-2" // Apply the bobbing class
      />
        </div>

          <div className="relative mb-18">
          <img
            src="/images/plantGrowth.png"
            className="absolute top-[-90px] left-1/2 transform -translate-x-1/2"
            alt="Plant Growth"
          />
            <div className="font-mono bg-white border-black border-8 rounded-md shadow-md px-32 py-16 inline-block text-center mb-20">
              <p className="font-mono text-2xl text-black mb-4">
                Let me know what kind of aspect you want to improve yourself?
              </p>

              <textarea
                className="font-mono text-black text-2xl text-center outline-none py-2 px-4 resize-none rounded-md w-full h-20"
                placeholder="Such as mental health, relationship,physical health, anything you could think of!"
                value={textareaInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
          </div>
        </div>
        </div>
      {/* </div> */}

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
