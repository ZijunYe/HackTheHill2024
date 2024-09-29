// src/hooks/useTaskCompletion.js
import { useState } from "react";

// Custom hook to manage task completion
export function useTaskCompletion(task_id, onCompletionChange) {
  const [isCompleted, setIsCompleted] = useState(false);

  // Toggle completion status
  const toggleCompletion = () => {
    const newCompletionState = !isCompleted;
    setIsCompleted(newCompletionState);

    // Notify parent of the completion status change
    if (onCompletionChange) {
      onCompletionChange(task_id, newCompletionState);
    }
  };

  return { isCompleted, toggleCompletion };
}
