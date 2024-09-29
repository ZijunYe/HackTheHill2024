import { useState,useEffect } from "react";
import Link from 'next/link';

// Puppy selection component
function PuppySelection() {
  const [selectedPuppy, setSelectedPuppy] = useState(null);

  const puppies = [
    { id: 1, name: "rabbit", img: "/images/rabbit.gif" },
    { id: 2, name: "doggy", img: "/images/doggy.gif" },
    // { id: 3, name: "cat1", img: "/images/cat1.png" },
  ];

  const handlePuppySelect = (id) => {
    setSelectedPuppy(id); // Set the selected puppy's ID
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4] animate-moveIn">
      <h1 className="font-pixelify text-6xl text-black">
        Pick your Puppy <br /> to accompany your journey!
      </h1>
      <div className="grid grid-cols-4 gap-6 mt-12">
        {puppies.map((puppy) => (
          <img
            key={puppy.id}
            src={puppy.img}
            alt={puppy.name}
            className={`w-20 h-20 cursor-pointer rounded-md ${
              selectedPuppy === puppy.id
                ? 'ring-4 ring-red-400' // Apply red ring if selected
                : 'hover:ring-4 hover:ring-red-400'
            }`}
            onClick={() => handlePuppySelect(puppy.id)}
          />
        ))}
      </div>

      {selectedPuppy ? (
        <Link href="/roadmap">
          <button className="mt-12 px-10 py-4 bg-red-600 text-white font-pixelify rounded-full text-3xl">
            Start Plan
          </button>
        </Link>
      ) : (
        <button
          disabled
          className="mt-12 px-10 py-4 bg-gray-400 text-white font-pixelify rounded-full text-3xl cursor-not-allowed"
        >
          Start Plan
        </button>
      )}
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
      setIsLoading(true); // Set loading to false after fetching
    }, 6000);
  }, []);

  const handlePuppySelect = (puppyId) => {
    console.log("Puppy selected with ID:", puppyId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4]">
      {isLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4] animate-moveIn">
          <h1 className="font-pixelify text-8xl text-black">Hold On</h1>
          <h2 className="font-pixelify text-8xl text-black mt-4">{name}</h2>
          <div className="mt-16">
            <img src="/images/house.gif" alt="Pixel House" className="w-60 h-auto" />
          </div>
          <p className="font-mono  text-3xl text-black mt-8">We are generating your Plan~</p>
        </div>
      ) : (
        // Render PuppySelection if data is not null
        data ? (
          <PuppySelection onPuppySelect={handlePuppySelect} />
        
        ) : (
          // Render another screen if no data is available
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4] animate-moveIn">
            <h1 className="font-pixelify text-6xl text-black">No Plan Available</h1>
            <p className="font-pixelify text-2xl text-black mt-8">Please try again later.</p>
          </div>
        )
      )}
    </div>
  );
}
