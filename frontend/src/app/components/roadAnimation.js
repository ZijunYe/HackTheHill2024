"use client";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, steps } from "framer-motion";
import TaskCard from "../component/TaskCard";
import Tile from "./Roadmap/Tile";
export default function RoadAnimation() {
  const svgCount_horz = 5; // Number of times the pattern repeats
  const svgCount_vert = 3; // Vertical loop length after the first small loop
  const svgSize = 90;
  const [isRabitFirstBlock, setisRabitFirstBlock] = useState(true);
  const [data, setData] = useState(null);
  const [roadMap, setRoadMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]); // Track completed tasks
  const [taskCompleted, setTaskCompleted] = useState(false); // Track if the task is completed
  const [isCompleted, setIsCompleted] = useState(false); // Track task completion

  const movementSequence = [
    { direction: "down", steps: 1 },
    { direction: "right", steps: 1 },
    { direction: "down", steps: 1 },
    { direction: "left", steps: 1 },
  ];

  // Optional delay function
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [moveInProgress, setMoveInProgress] = useState(false); // Track if move is in progress

  // Refs to hold the latest state values
  const resolveMoveRef = useRef(null); // Create a ref to store resolveMove
  const positionRef = useRef({ left: 30, top: 0 }); // Ref to keep track of the latest position

  // State Variables for Position and Movement
  const [position, setPosition] = useState({ left: 30, top: 0 }); // Rabbit's position
  const [currentMovementIndex, setCurrentMovementIndex] = useState(0); // Index in movementSequence
  const [stepsTaken, setStepsTaken] = useState(0); // Steps taken in current direction
  const [isMoving, setIsMoving] = useState(false); // Movement state

  // **1. Define `currentMovementIndex` Before Its Ref**
  const currentMovementIndexRef = useRef(currentMovementIndex); // Define after `currentMovementIndex`

  // **2. Synchronize `currentMovementIndexRef` with `currentMovementIndex`**
  useEffect(() => {
    currentMovementIndexRef.current = currentMovementIndex;
    console.log(
      `currentMovementIndexRef updated to: ${currentMovementIndexRef.current}`
    );
  }, [currentMovementIndex]);

  // **3. Synchronize `positionRef` with `position` State**
  useEffect(() => {
    positionRef.current = position;
    console.log(
      `positionRef updated to: left=${position.left}, top=${position.top}`
    );
  }, [position]);
  // Handler for button press to move the rabbit
  useEffect(() => {
    const idleImage = new Image();
    idleImage.src = "/images/rabbit.gif";

    const walkingImage = new Image();
    walkingImage.src = "/images/moving/rabbit_walking.gif";

    const walkingDownImage = new Image();
    walkingDownImage.src = "/images/moving/rabbit_walking_down.gif";
  }, []);

  // Helper function to get the previous movement direction
  const getPreviousDirection = () => {
    const previousIndex =
      (currentMovementIndex - 1 + movementSequence.length) %
      movementSequence.length;
    return movementSequence[previousIndex].direction;
  };

  // Determine the image source based on movement state and direction
  const getImageSource = () => {
    if (isMoving) {
      const prevDirection = getPreviousDirection();
      if (prevDirection === "down") {
        return "/images/moving/rabbit_walking_down.gif";
      } else {
        return "/images/moving/rabbit_walking.gif";
      }
    } else {
      return "/images/rabbit.gif";
    }
  };

  // Handler for button press to move the rabbit
  const handleMove = () => {
    return new Promise((resolve) => {
      if (isMoving) {
        console.log("Already moving, skipping this move.");
        resolve(); // Optionally resolve immediately if already moving
        return;
      }

      setIsMoving(true); // Mark that a move is in progress
      resolveMoveRef.current = resolve; // Store the resolve function

      const currentMovement = movementSequence[currentMovementIndexRef.current];
      if (!currentMovement) {
        console.log("No current movement defined.");
        resolve();
        setIsMoving(false);
        return;
      }

      const { direction, steps } = currentMovement;

      // Get the latest position from the ref
      let newLeft = positionRef.current.left;
      let newTop = positionRef.current.top;
      var speed = 4;
      if (isRabitFirstBlock && direction === "down") {
        speed = 1;
        setisRabitFirstBlock(false);
      } else {
        speed = 4;
      }
      switch (direction) {
        case "down":
          newTop += svgSize * speed;
          break;
        case "right":
          newLeft += svgSize * speed;
          break;
        case "left":
          newLeft -= svgSize * speed;
          break;
        case "up":
          newTop -= svgSize * speed;
          break;
        default:
          console.warn(`Unknown direction: ${direction}`);
          break;
      }

      console.log(`Moving ${direction}: newLeft=${newLeft}, newTop=${newTop}`);

      // Update position state
      setPosition({ left: newLeft, top: newTop });

      // Update steps taken and movement index
      if (stepsTaken + 1 >= steps) {
        setStepsTaken(0);
        setCurrentMovementIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % movementSequence.length;
          currentMovementIndexRef.current = newIndex; // Update the ref
          return newIndex;
        });
      } else {
        setStepsTaken((prevSteps) => prevSteps + 1);
      }
    });
  };
  let cumulativeIndex = 0; // Initialize cumulativeIndex

  useEffect(() => {
    // Fetch data on the client side
    async function fetchData() {
      const res = await fetch("/api/get_roadmap ");
      const result = await res.json();
      console.log(result["roadmap_data"]["roadmap"]);
      setData(result[0]);
      setRoadMap(result["roadmap_data"]["roadmap"]);
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!moveInProgress && taskCompleted) {
      // Trigger the next move when the current one is complete
      console.log("Move completed, starting the next one");
      handleCompletionChange(task_id, true); // Pass the task_id and completion status
    }
  }, [moveInProgress, taskCompleted]); // Run when moveInProgress or taskCompleted is updated
  // Callback to handle task completion state changes
  const handleCompletionChange = async (task_id, isTaskCompleted) => {
    if (isTaskCompleted) {
      setCompletedTasks((prev) => [...prev, task_id]);
      setIsCompleted(true); // Mark the task as completed
      console.log(`Task ${task_id} completed!`);

      for (let index = 0; index < 2; index++) {
        // Adjust the number of moves as needed
        console.log(`Starting move ${index}`);
        await handleMove(); // Wait for the current move to complete
        console.log(`Move ${index} completed`);
        await delay(500); // Optional delay between moves
      }

      console.log("All moves completed");
    } else {
      setCompletedTasks((prev) => prev.filter((id) => id !== task_id));
      console.log(`Task ${task_id} marked as incomplete.`);
    }
  };
  if (loading) return <p>Loading...</p>;

  return (
    <main className="pl-20 min-h-screen w-full">
      <div className="">
        {/* Container for Rabbit Image */}

        {/* Rabbit Image */}
        <motion.img
          src={getImageSource()}
          width={svgSize}
          height={svgSize}
          className="absolute z-10"
          style={{
            transform:
              getPreviousDirection() === "right" ? "scaleX(1)" : "scaleX(-1)", // Flip horizontally when moving left
          }}
          animate={{
            left: `${position.left + 80}px`,
            top: `${position.top + 0}px`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 200,
          }}
          onAnimationStart={() => {
            console.log("Animation started");
            setIsMoving(true); // Optional: Already set in handleMove
          }}
          onAnimationComplete={() => {
            console.log("Animation complete");
            setIsMoving(false); // Reset the isMoving flag

            if (resolveMoveRef.current) {
              console.log("Resolving move promise");
              resolveMoveRef.current(); // Resolve the current move
              resolveMoveRef.current = null; // Reset the ref
            } else {
              console.log("No move promise to resolve");
            }
          }}
        />
        <div>
          <div className="flex flex-col w-full ">
            {Array.from({ length: 1 }).map((_, index) => {
              const delay = 250 * cumulativeIndex;
              cumulativeIndex += 1;
              return (
                <div className="flex flex-row">
                  <Tile
                    svgSize={svgSize}
                    svgCount_horz={svgCount_horz}
                    index={index}
                    delay={delay}
                    type={"vertical-left"}
                  ></Tile>
                </div>
              );
            })}
          </div>

          {/* Repeating Pattern */}
          {roadMap.map((item, index_road) => (
            <div>
              {index_road == 0 || index_road % 2 === 0 ? (
                <div>
                  {/* Horizontal Loop */}
                  <div className="flex flex-row h-full jusitfy-center items-center">
                    {Array.from({ length: svgCount_horz }).map((_, index) => {
                      const delay = 250 * cumulativeIndex;
                      cumulativeIndex += 1;
                      // Randomly choose between grass (green) or dirt (brown)
                      return (
                        <div className="">
                          <Tile
                            svgSize={svgSize}
                            svgCount_horz={svgCount_horz}
                            index={index}
                            delay={delay}
                            type={"horizontal"}
                          ></Tile>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vertical Loop (length svgCount_vert) */}
                  <div className="flex flex-col w-full ">
                    {Array.from({ length: svgCount_vert }).map((_, index) => {
                      const delay = 250 * cumulativeIndex;
                      cumulativeIndex += 1;

                      // Set tile color based on type

                      console.log("test");
                      return (
                        <div className="flex flex-row">
                          <Tile
                            svgSize={svgSize}
                            svgCount_horz={svgCount_horz}
                            index={index}
                            delay={delay}
                            type={"vertical-right"}
                          ></Tile>
                          {index === 0 ? (
                            <div
                              className="absoluteflex  ml-[450px] w-full animate-jump-in animate-once animate-ease-out "
                              style={{
                                animationDelay: `${delay}ms`,
                              }}
                            >
                              <TaskCard
                                task_description={item["Description"]}
                                task_id={item["Index"] + 1}
                                task_duration={item["Days"]}
                                task_Name={item["Task"]}
                                onCompletionChange={handleCompletionChange}
                              />
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
                            <div className="">
                              <Tile
                                svgSize={svgSize}
                                svgCount_horz={svgCount_horz}
                                index={index}
                                delay={delay}
                                type={"horizontal-reverse"}
                              ></Tile>
                            </div>
                          );
                        }
                      );
                    })()}
                  </div>

                  {roadMap[index_road + 1] && (
                    <div>
                      {Array.from({ length: svgCount_vert }).map((_, index) => {
                        const delay = 250 * cumulativeIndex;
                        cumulativeIndex += 1;
                        return (
                          <div className="flex flex-row">
                            <Tile
                              svgSize={svgSize}
                              svgCount_horz={svgCount_horz}
                              index={index}
                              delay={delay}
                              type={"vertical-left"}
                            ></Tile>
                            {index === 0 ? (
                              <div
                                className=" ml-10 flex mt-10  animate-jump-in animate-once animate-ease-out "
                                style={{
                                  animationDelay: `${delay}ms`,
                                }}
                              >
                                <TaskCard
                                  task_description={
                                    roadMap[index_road + 1]["Description"]
                                  }
                                  task_id={roadMap[index_road + 1]["Index"] + 1}
                                  task_duration={
                                    roadMap[index_road + 1]["Days"]
                                  }
                                  task_Name={roadMap[index_road + 1]["Task"]}
                                  onCompletionChange={handleCompletionChange}
                                />
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
