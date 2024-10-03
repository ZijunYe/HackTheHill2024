// components/TaskCard.jsx
"use client"; // Ensures this is a client-side component in Next.js

import React from "react";
import PropTypes from "prop-types";
import { useTaskCompletion } from "@/app/hooks/useTaskCompletion"; // Ensure this path is correct

export default function TaskCard({
  task_id,
  task_Name,
  task_description,
  task_duration,
  task_difficultyLevel, // Corrected prop name
  onCompletionChange,
}) {
  const { isCompleted, toggleCompletion } = useTaskCompletion(
    task_id,
    onCompletionChange
  );

  return (
    <div className="bg-white rounded-lg outline outline-2 outline-black w-[500px] p-6 relative z-10">
      {/* Header with Task Number and Name */}
      <div className="flex items-center">
        <h1 className="font-pixelify font-bold text-5xl">
          {String(task_id).startsWith("1") ? task_id : parseInt(task_id) - 1}
        </h1>
        <h1 className="font-mono font-bold text-4xl p-2">{task_Name}</h1>
      </div>

      {/* Task Description */}
      <p className="text-lg leading-relaxed mb-8">{task_description}</p>

      {/* Task Details */}
      <div className="space-y-4">
        <div className="flex">
          <h2 className="text-xl font-medium">Duration:</h2>
          <p className="ml-2 text-lg">
            {task_duration} day{task_duration > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex">
          <h2 className="text-xl font-medium">Difficulty Level:</h2>
          <p className="ml-2 text-lg">{task_difficultyLevel}</p>
        </div>
      </div>

      {/* Completion Checkpoint */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-xl font-semibold">Completion:</p>

        {/* Clickable Indicator */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ${
            isCompleted ? "bg-green-600" : "bg-red-600"
          }`}
          onClick={toggleCompletion}
          aria-label={`Mark task ${task_id} as ${
            isCompleted ? "incomplete" : "completed"
          }`}
          role="checkbox"
          aria-checked={isCompleted}
        >
          {/* Conditionally render check or uncheck based on the completion status */}
          {isCompleted ? (
            <span className="text-white text-xl">✔</span> // Check mark
          ) : (
            <span className="text-white text-xl">✖</span> // Cross mark
          )}
        </div>
      </div>
    </div>
  );
}

TaskCard.propTypes = {
  task_id: PropTypes.number.isRequired,
  task_Name: PropTypes.string.isRequired,
  task_description: PropTypes.string.isRequired,
  task_duration: PropTypes.number.isRequired,
  task_difficultyLevel: PropTypes.string.isRequired,
  onCompletionChange: PropTypes.func.isRequired,
};
