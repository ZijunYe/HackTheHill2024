"use client";
import React from "react";
import TaskCard from "@/app/components/Roadmap/TaskCard";

export default function TaskCardWrapper({ delay, task, onCompletionChange }) {
  return (
    <div
      className="absolute flex ml-10 w-full animate-jump-in animate-once animate-ease-out"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <TaskCard
        task_description={task["Description"]}
        task_id={task["Index"] + 1}
        task_duration={task["Days"]}
        task_Name={task["Task"]}
        onCompletionChange={onCompletionChange}
      />
    </div>
  );
}
