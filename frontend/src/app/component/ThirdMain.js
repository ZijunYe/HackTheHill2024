import { useState, useEffect } from "react";

export default function ThirdMain({ name, textareaInput, onSubmit }) {
  const [goalDuration, setGoalDuration] = useState("");
  const [leftVisibleTrees, setLeftVisibleTrees] = useState(0);
  const [rightVisibleTrees, setRightVisibleTrees] = useState(0);
  const [treeScales, setTreeScales] = useState({
    left: [0, 0, 0],
    right: [0, 0, 0],
  });

  // To handle the staggered tree rendering effect on both sides
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

  // Increment the tree scales progressively
  useEffect(() => {
    const treeGrowInterval = setInterval(() => {
      setTreeScales((prev) => ({
        left: prev.left.map((scale, i) =>
          i < leftVisibleTrees ? Math.min(scale + 0.1, 1) : scale
        ), // Max scale is 1 (full size)
        right: prev.right.map((scale, i) =>
          i < rightVisibleTrees ? Math.min(scale + 0.1, 1) : scale
        ),
      }));
    }, 300); // Control how fast the trees grow

    return () => clearInterval(treeGrowInterval);
  }, [leftVisibleTrees, rightVisibleTrees]);


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

    <div className="flex flex-col items-center justify-center animate-moveIn">
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
          <p className="font-mono  text-2xl text-black mb-4">
            How long do you want to achieve this goal? (Such as
            #days, #weeks, #months, etc)
          </p>

          <textarea
            className="font-mono text-black text-2xl font-pixelify text-center outline-none py-2 px-4 resize-none rounded-md w-full h-20"
            placeholder="Enter your goal duration here..."
            value={goalDuration}
            onChange={(e) => setGoalDuration(e.target.value)}
            onKeyDown={handleKeyDown} // Handle "Enter" key to submit goal duration
          />
        </div>
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
              className="w-28 h-auto transition-transform duration-300 ease-in-out"
              style={{
                transform: `scale(${treeScales.left[index]})`, // Dynamic scaling
                transformOrigin: 'bottom', // Grows from bottom to top
              }}
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
              className="w-28 h-auto transition-transform duration-300 ease-in-out"
              style={{
                transform: `scale(${treeScales.right[index]})`, // Dynamic scaling
                transformOrigin: 'bottom', // Grows from bottom to top
              }}
            />
          ))}
      </div>
    </div>
    </div>
  );
}

