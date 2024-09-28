// export default function GeneratingPlan({ name }) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4]">
//         <h1 className="font-pixelify text-6xl text-black">Hold On</h1>
//         <h2 className="font-pixelify text-6xl text-black mt-4">{name}</h2>
  
//         <div className="mt-12">
//           <img src="/images/house.gif" alt="Pixel House" className="w-96 h-96" />
//         </div>
  
//         <p className="font-pixelify text-2xl text-black mt-8">We are generating your Plan~</p>
//       </div>
//     );
//   }
  



import { useState, useEffect } from "react";

// Puppy selection component
function PuppySelection({ onPuppySelect }) {
  const puppies = [
    { id: 1, name: "bear", img: "/images/bear.png" },
    { id: 2, name: "cow", img: "/images/cow.png" },
    { id: 3, name: "cat1", img: "/images/cat1.png" },
    { id: 4, name: "cat2", img: "/images/cat2.png" },
    { id: 5, name: "frog", img: "/images/frog.png" },
    { id: 6, name: "rabbit", img: "/images/rabbit.png" },
    { id: 7, name: "turtle", img: "/images/turtle.png" },
    { id: 8, name: "frog2", img: "/images/frog2.png" },
    { id: 9, name: "robot", img: "/images/robot.png" },
    { id: 10, name: "bull", img: "/images/bull.png" },
    { id: 11, name: "pig", img: "/images/pig.png" },
    { id: 12, name: "bunny", img: "/images/bunny.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4]">
      <h1 className="font-pixelify text-6xl text-black">Choose Your Puppy</h1>
      <div className="grid grid-cols-4 gap-6 mt-12">
        {puppies.map((puppy) => (
          <img
            key={puppy.id}
            src={puppy.img}
            alt={puppy.name}
            className="w-20 h-20 cursor-pointer hover:ring-4 hover:ring-red-400"
            onClick={() => onPuppySelect(puppy.id)}
          />
        ))}
      </div>
      <button className="mt-12 px-10 py-4 bg-red-600 text-white font-pixelify rounded-full text-3xl">
        Start Plan
      </button>
    </div>
  );
}

export default function GeneratingPlan({ name }) {
  const [isLoading, setIsLoading] = useState(true); // Manage loading state
  const [data, setData] = useState(null); // Manage the data from the backend

  useEffect(() => {
    // Mocked data fetch: replace with actual API call
    setTimeout(() => {
      // Simulate getting data after 2 seconds
      const fetchedData = null; // Change this to simulate real data or null
      setData(fetchedData); // Set fetched data
      setIsLoading(false); // Set loading to false after fetching
    }, 2000);
  }, []);

  const handlePuppySelect = (puppyId) => {
    console.log("Puppy selected with ID:", puppyId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4]">
      {isLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4]">
          <h1 className="font-pixelify text-6xl text-black">Hold On</h1>
          <h2 className="font-pixelify text-6xl text-black mt-4">{name}</h2>
          <div className="mt-12">
            <img src="/images/house.gif" alt="Pixel House" className="w-96 h-96" />
          </div>
          <p className="font-pixelify text-2xl text-black mt-8">We are generating your Plan~</p>
        </div>
      ) : (
        // Render PuppySelection if data is not null
        data ? (
          <PuppySelection onPuppySelect={handlePuppySelect} />
        ) : (
          // Render another screen if no data is available
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4]">
            <h1 className="font-pixelify text-6xl text-black">No Plan Available</h1>
            <p className="font-pixelify text-2xl text-black mt-8">Please try again later.</p>
          </div>
        )
      )}
    </div>
  );
}
