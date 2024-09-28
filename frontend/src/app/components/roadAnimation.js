export default function RoadAnimation() {
  const svgCount_horz = 5; // Number of times the pattern repeats
  const svgCount_vert = 3; // Vertical loop length after the first small loop
  const svgSize = 80;
  let cumulativeIndex = 0; // Initialize cumulativeIndex

  return (
    <main className="pl-20 min-h-screen w-full">
      <div className="h-full">
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
                    style={{ stroke: "white", fill: "black" }}
                  />
                </svg>
              </div>
            );
          })}

          {/* Repeating Pattern */}
          {Array.from({ length: 2 }).map((_, loopIndex) => (
            <div key={`pattern-${loopIndex}`}>
              {/* Horizontal Loop */}
              <div className="flex flex-row">
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
                            style={{ stroke: "white", fill: "black" }}
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
                            style={{ stroke: "white", fill: "black" }}
                          />
                        ) : (
                          <rect
                            width={svgSize}
                            height={svgSize}
                            style={{ stroke: "white", fill: "black" }}
                          />
                        )}
                      </svg>
                    </div>
                  );
                })}
              </div>

              {/* Vertical Loop (length svgCount_vert) */}
              <div className="flex flex-col">
                {Array.from({ length: svgCount_vert }).map((_, index) => {
                  const delay = 250 * cumulativeIndex;
                  cumulativeIndex += 1;

                  return (
                    <div
                      className="flex flex-col"
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
                      className="flex flex-col"
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
