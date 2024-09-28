export default function RoadAnimation() {
  const svgCount = 4;

  return (
    <main className="p-10 min-h-screen w-full">
      <div className="h-full">
        <div>
          <div>
            {Array.from({ length: svgCount }).map((_, index) => (
              <div className="flex flex-col" key={index}>
                <svg
                  className="animate-jump-in animate-once animate-ease-out"
                  xmlns="http://www.w3.org/2000/svg"
                  width={100}
                  height={100}
                  style={{ animationDelay: `${250 * (index + 1)}ms` }} // Dynamic delay
                >
                  <rect
                    xmlns="http://www.w3.org/2000/svg"
                    width={100}
                    height={100}
                    style={{ stroke: "rgb(0, 0, 0)" }}
                  />
                </svg>
              </div>
            ))}
            <div className="flex flex-row">
              {Array.from({ length: svgCount }).map((_, index) => (
                <div className="" key={index}>
                  <svg
                    className="animate-jump-in animate-once animate-ease-out"
                    xmlns="http://www.w3.org/2000/svg"
                    width={100}
                    height={100}
                    style={{ animationDelay: `${250 * (index + 1)}ms` }} // Dynamic delay
                  >
                    <rect
                      xmlns="http://www.w3.org/2000/svg"
                      width={100}
                      height={100}
                      style={{ stroke: "rgb(0, 0, 0)" }}
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-col ">
              {Array.from({ length: svgCount }).map((_, index) => (
                <div className="flex flex-col" key={index}>
                  <svg
                    className="animate-jump-in animate-once animate-ease-out"
                    xmlns="http://www.w3.org/2000/svg"
                    x={100 * svgCount}
                    y={100 * svgCount}
                    width={100}
                    height={100}
                    style={{ animationDelay: `${250 * (index + 1)}ms` }} // Dynamic delay
                  >
                    <rect
                      xmlns="http://www.w3.org/2000/svg"
                      width={100}
                      height={100}
                      style={{ stroke: "rgb(1, 50, 0)", background: "white" }}
                    />
                  </svg>
                </div>
              ))}
            </div>
            <div className="flex flex-row">
              {Array.from({ length: svgCount }).map((_, index) => (
                <div className="" key={index}>
                  <svg
                    className="animate-jump-in animate-once animate-ease-out"
                    xmlns="http://www.w3.org/2000/svg"
                    width={100}
                    height={100}
                    style={{ animationDelay: `${250 * (index + 1)}ms` }} // Dynamic delay
                  >
                    <rect
                      xmlns="http://www.w3.org/2000/svg"
                      width={100}
                      height={100}
                      style={{ stroke: "rgb(0, 0, 0)" }}
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
