"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import TaskCard from "../component/TaskCard";
export default function RoadAnimation() {
  const svgCount_horz = 5; // Number of times the pattern repeats
  const svgCount_vert = 3; // Vertical loop length after the first small loop
  const svgSize = 90;

  const movementSequence = [
    { direction: "down", steps: 1 },
    { direction: "right", steps: 1 },
    { direction: "down", steps: 1 },
    { direction: "left", steps: 1 },
  ];

  // State Variables
  const [position, setPosition] = useState({ left: 0, top: 0 }); // Rabbit's position
  const [currentMovementIndex, setCurrentMovementIndex] = useState(0); // Index in movementSequence
  const [stepsTaken, setStepsTaken] = useState(0); // Steps taken in current direction
  const [isMoving, setIsMoving] = useState(false); // Movement state

  // Handler for button press to move the rabbit
  const handleMove = () => {
    const currentMovement = movementSequence[currentMovementIndex];
    const direction = currentMovement;
    const steps = 1;

    // Calculate new position based on direction
    let newLeft = position.left;
    let newTop = position.top;

    switch (direction) {
      case "down":
        newTop += svgSize * 3;
        break;
      case "right":
        newLeft += svgSize * 4;
        break;
      case "left":
        newLeft -= svgSize * 5;
        break;

      default:
        break;
    }

    // Boundary Checks to prevent moving out of grid

    // Update Position
    setPosition({ left: newLeft, top: newTop });

    // Increment steps taken in current direction
    if (stepsTaken + 1 >= steps) {
      // Reset steps and move to next movement in the sequence
      setStepsTaken(0);
      setCurrentMovementIndex(
        (prevIndex) => (prevIndex + 1) % movementSequence.length
      );
    } else {
      setStepsTaken((prevSteps) => prevSteps + 1);
    }
  };

  let cumulativeIndex = 0; // Initialize cumulativeIndex

  return (
    <main className="pl-20 min-h-screen w-full">
      <div>
        <button
          onClick={handleMove}
          className="mb-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Move Rabbit
        </button>

        {/* Container for Rabbit Image */}

        {/* Rabbit Image */}
        <motion.img
          src={
            isMoving
              ? "/images/moving/rabbit_walking.gif"
              : "/images/rabbit.gif"
          }
          width={svgSize}
          height={svgSize}
          className="absolute z-10"
          style={{
            left: `${position.left + 20}px`,
            top: `${position.top + 50}px`,
            transform:
              movementSequence[currentMovementIndex].direction === "left"
                ? "scaleX(-1)"
                : "scaleX(1)", // Flip horizontally when moving left
          }}
          animate={{
            left: `${position.left + 20}px`,
            top: `${position.top + 50}px`,
          }}
          transition={{
            type: "spring",
            stiffness: 300, // Increased from 0 to 300
            damping: 200, // Reduced from 100 to 20 for smoother animation
          }}
          onAnimationStart={() => setIsMoving(true)}
          onAnimationComplete={() => setIsMoving(false)}
        />

        <div>
          {/* First Vertical Loop (custom, length 1) */}
          {Array.from({ length: 1 }).map((_, index) => {
            const delay = 250 * cumulativeIndex;
            cumulativeIndex += 1;

            return (
              <div className="flex flex-col" key={`first-vertical-${index}`}>
                <svg
                  className="animate-jump-in animate-once animate-ease-out"
                  xmlns="http://www.w3.org/2000/svg"
                  width={svgSize}
                  height={svgSize}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {/* Custom SVG for the first vertical block */}
                  <path
                    d={`M 0 30 Q 0 0 30 0 H ${
                      svgSize - 30
                    } Q ${svgSize} 0 ${svgSize} 30 V ${svgSize} H 0 Z`}
                    style={{ stroke: "white", fill: "rgb(255, 218, 179)" }}
                  />
                </svg>
              </div>
            );
          })}

          {/* Repeating Pattern */}
          {Array.from({ length: 2 }).map((_, loopIndex) => (
            <div key={`pattern-${loopIndex}`}>
              {/* Horizontal Loop */}
              <div className="flex flex-row h-full jusitfy-center items-center">
                {Array.from({ length: svgCount_horz }).map((_, index) => {
                  const delay = 250 * cumulativeIndex;
                  cumulativeIndex += 1;

                  return (
                    <div className="" key={`horizontal-${loopIndex}-${index}`}>
                      <svg
                        className="animate-jump-in animate-once animate-ease-out"
                        xmlns="http://www.w3.org/2000/svg"
                        width={svgSize}
                        height={svgSize}
                        style={{ animationDelay: `${delay}ms` }}
                      >
                        {/* SVG elements with special shapes for first and last elements */}
                        {index === 0 ? (
                          <path
                            d={`
                              M 0 0
                              H ${svgSize}
                              V ${svgSize}
                              H 30
                              Q 0 ${svgSize} 0 ${svgSize - 30}
                              V 0
                              Z
                            `}
                            fill="white"
                            style={{
                              stroke: "white",
                              fill: "rgb(255, 218, 179)",
                            }}
                          />
                        ) : index === svgCount_horz - 1 ? (
                          <path
                            d={`
                              M 0 0
                              H ${svgSize - 30}
                              Q ${svgSize} 0 ${svgSize} 30
                              V ${svgSize}
                              H 0
                              V 0
                              Z
                            `}
                            fill="white"
                            style={{
                              stroke: "white",
                              fill: "rgb(255, 218, 179)",
                            }}
                          />
                        ) : (
                          <rect
                            width={svgSize}
                            height={svgSize}
                            style={{ stroke: "white" }}
                            fill="rgb(255, 218, 179)"
                          />
                        )}
                      </svg>
                    </div>
                  );
                })}
              </div>

              {/* Vertical Loop (length svgCount_vert) */}
              <div className="flex flex-col w-full ">
                {Array.from({ length: svgCount_vert }).map((_, index) => {
                  const delay = 250 * cumulativeIndex;
                  cumulativeIndex += 1;

                  return (
                    <div
                      className="flex flex-row"
                      key={`vertical-${loopIndex}-${index}`}
                    >
                      <svg
                        className="animate-jump-in animate-once animate-ease-out"
                        xmlns="http://www.w3.org/2000/svg"
                        width={svgSize}
                        height={svgSize}
                        style={{
                          position: "relative",
                          left: `${svgSize * svgCount_horz - svgSize}px`,
                          animationDelay: `${delay}ms`,
                        }}
                      >
                        <rect
                          width={svgSize}
                          height={svgSize}
                          style={{ stroke: "white", fill: "black" }}
                        />
                      </svg>
                      {index === 1 ? (
                        <div
                          className=" w-full flex p-100 justify-end animate-jump-in animate-once animate-ease-out "
                          style={{
                            animationDelay: `${delay}ms`,
                          }}
                        >
                          <TaskCard className=" pl-10  flex " />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Horizontal Loop (animates from right to left) */}
              <div className="flex flex-row">
                {(() => {
                  const loopStartIndex = cumulativeIndex;
                  const loopLength = svgCount_horz;
                  return Array.from({ length: svgCount_horz }).map(
                    (_, index) => {
                      const delay =
                        250 * (loopStartIndex + loopLength - 1 - index); // Reverse delay
                      cumulativeIndex += 1;

                      return (
                        <div
                          className=""
                          key={`reverse-horizontal-${loopIndex}-${index}`}
                        >
                          <svg
                            className="animate-jump-in animate-once animate-ease-out"
                            xmlns="http://www.w3.org/2000/svg"
                            width={svgSize}
                            height={svgSize}
                            style={{ animationDelay: `${delay}ms` }}
                          >
                            {index === svgCount_horz - 1 ? (
                              // Last index, special path for bottom-right corner
                              <path
                                d={`
                M 0 0
                H ${svgSize}
                V ${svgSize - 30}
                Q ${svgSize} ${svgSize} ${svgSize - 30} ${svgSize}
                H 0
                V 0
                Z
              `}
                                style={{ stroke: "white", fill: "black" }}
                              />
                            ) : index === 0 ? (
                              // First index, special path for top-left corner
                              <path
                                d={`
                M 0 30
                Q 0 0 30 0
                H ${svgSize}
                V ${svgSize}
                H 0
                V 30
                Z
              `}
                                style={{ stroke: "white", fill: "black" }}
                              />
                            ) : (
                              // Normal rectangle for other blocks
                              <rect
                                width={svgSize}
                                height={svgSize}
                                style={{ stroke: "white", fill: "black" }}
                              />
                            )}
                          </svg>
                        </div>
                      );
                    }
                  );
                })()}
              </div>
              <div>
                {" "}
                {Array.from({ length: svgCount_vert }).map((_, index) => {
                  const delay = 250 * cumulativeIndex;
                  cumulativeIndex += 1;

                  return (
                    <div
                      className="flex flex-row"
                      key={`first-vertical-${index}`}
                    >
                      <svg
                        className="animate-jump-in animate-once animate-ease-out"
                        xmlns="http://www.w3.org/2000/svg"
                        width={svgSize}
                        height={svgSize}
                        style={{ animationDelay: `${delay}ms` }}
                      >
                        {/* Custom SVG for the first vertical block */}
                        <rect
                          width={svgSize}
                          height={svgSize}
                          style={{ stroke: "white", fill: "black" }}
                        />
                      </svg>
                      {index === 1 ? (
                        <div
                          className=" w-full  flex justify-end animate-jump-in animate-once animate-ease-out "
                          style={{
                            animationDelay: `${delay}ms`,
                          }}
                        >
                          <TaskCard className=" pl-10  flex " />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
