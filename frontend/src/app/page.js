"use client";

export default function Home() {

  return (
    <div className="p-20 bg-[#FFF3E6] max-h-screen">

      <div className="border-black border-8 rounded-xl grid p-64 items-center justify-items-center max-h-screen">
            <div className="relative flex items-center justify-center">
            <img className="w-96 h-96 absolute z-10" src="/images/Ellipse.svg" alt="Ellipse" />
            <img className="w-96 h-96 relative z-20" src="/images/mountain.gif" alt="Mountain" />
          </div>

          <h1 className="font-pixelify text-8xl sm:text-8xl text-center text-black">
            Self Improvement
          </h1>
        
          <div className="flex flex-col items-center">
          <form className="flex flex-col items-center space-y-4" >
            <input
              type="text"
              name="username"
              placeholder="Start with your name"
              className="bg-black text-white border-8 border-white rounded-xl px-20 py-5 text-lg focus:outline-none shadow-md focus:ring-2 focus:ring-black placeholder:font-pixelify placeholder:text-white placeholder:font-5xl"
              onKeyDown={(e) => {
                if (e.key === "Enter") {  
                  console.log('Form submitted with name:', e.target.value);
                }
              }}
            />
            </form>

            <div className="w-20 h-20 pt-4 animate-bounce cursor-pointer">
              <img className="w-64 h-auto" src="/images/cursor.png" alt="Cursor" />
            </div>
          </div>
      </div>
  </div>
  
  );
}
