"use client";
import React from "react";

export default function Tile({
  index,
  svgSize,
  delay,
  isFirst = false,
  isLast = false,
  isReverse = false,
  isVertical = false,
  svgCount_horz = 0,
  type = "default",
  roadMapItem,
  taskIndex,
}) {
  const chooseRandomTileType = () => {
    return Math.random() < 0.7 ? "grass" : "dirt"; // 70% grass, 30% dirt
  };

  const tileType = chooseRandomTileType();
  const tileColor = tileType === "grass" ? "#BEDC74" : "#FFEEAD";

  // Define SVG paths based on tile type and position
  const getSVGContent = () => {
    if (type === "horizontal-reverse") {
      console.log("horizontal-reverse");

      return (
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
              style={{
                stroke: "white",
              }}
              fill={tileColor}
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
              style={{
                stroke: "white",
              }}
              fill={tileColor}
            />
          ) : (
            // Normal rectangle for other blocks
            <rect
              width={svgSize}
              height={svgSize}
              style={{
                stroke: "white",
              }}
              fill={tileColor}
            />
          )}
        </svg>
      );
    } else if (type === "horizontal") {
      console.log("horizontal");
      return (
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
              style={{
                stroke: "white",
              }}
              fill={tileColor}
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
              style={{
                stroke: "white",
              }}
              fill={tileColor}
            />
          ) : (
            <rect
              width={svgSize}
              height={svgSize}
              style={{ stroke: "white" }}
              fill={tileColor}
            />
          )}
        </svg>
      );
    } else if (type === "vertical-left") {
      console.log("verticle left");
      return (
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
            style={{ stroke: "white" }}
            fill={tileColor}
          />
        </svg>
      );
    } else if (type === "vertical-right") {
      console.log("verticle right");
      return (
        <svg
          className="animate-jump-in animate-once animate-ease-out test "
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
            style={{ stroke: "white" }}
            fill={tileColor}
          />
        </svg>
      );
    }
    // Default rectangle for other tiles
  };

  return <div>{getSVGContent()}</div>;
}
