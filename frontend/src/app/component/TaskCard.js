import { useTaskCompletion } from "@/app/hooks/useTaskCompletion"; // Import your custom hook

import { useState } from "react";
export default function TaskCard({
  task_id,
  task_Name,
  task_description,
  task_duration,
  task_diffcultyLevel,
  onCompletionChange,
}) {
  const [isClicked, setIsClicked] = useState(false);
  const { isCompleted, toggleCompletion } = useTaskCompletion(
    task_id,
    onCompletionChange
  );
  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  return (
    <div className="absolute z-11 bg-white rounded-lg outline outline-2 outline-black w-[500px] p-6">
      {/* Header with Task Number and Name */}
      <div className="flex items-center">
        <h1 className="font-pixelify font-bold text-5xl">
        {String(task_id).startsWith('1') ? task_id : parseInt(task_id) - 1}
        </h1>
        <h1 className="font-mono font-bold text-4xl p-2">
          {task_Name} Task Name
        </h1>
      </div>

      {/* Task Description */}
      <p className="text-lg leading-relaxed mb-8">
        {task_description}
        {/* Simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. */}
      </p>

      {/* Task detail */}
      <div className="space-y-4">
        <div className="flex">
          <h2 className="text-xl font-medium">
            Duration:
            <br />
          </h2>
          <p className=" align-bottom justify-center ">{task_duration} days</p>
        </div>
        {/* <div className="flex">
          <h2 className="text-xl font-medium">
            Difficulty Level:
            <br />
          </h2>
          <p>{task_difficultyLevel} </p>
          <p className="text-lg pl-2">Task difficultyLevel</p>
        </div> */}
      </div>

      {/* Completion Checkpoint */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-xl font-semibold">Completion:</p>

        {/* Clickable image div */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
            isCompleted ? "bg-green-600" : "bg-red-600"
          }`}
          onClick={toggleCompletion}
        >
          {/* Conditionally render check or uncheck based on the completion status */}
          {isCompleted ? (
            <span className="text-white text-xl">✔</span> // Check mark
          ) : (
            <span className="text-white text-xl"> </span> // Unchecked mark
          )}
        </div>
      </div>
    </div>
  );
}
