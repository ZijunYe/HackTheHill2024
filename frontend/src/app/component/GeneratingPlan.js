import { useState, useEffect } from "react";
import Link from 'next/link';

// Puppy selection component
function PuppySelection({ onPuppySelect, name}) {
  const [selectedPuppy, setSelectedPuppy] = useState(null);

  const puppies = [
    { id: 1, name: "rabbit", img: "/images/rabbit.gif" },
    { id: 2, name: "doggy", img: "/images/doggy.gif" },
  ];

  const handlePuppySelect = (id) => {
    setSelectedPuppy(id); // Set the selected puppy's ID
    onPuppySelect(id); // Pass the selected puppy ID to the parent
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
        // <Link href="/roadmap">
        <Link href={`/roadmap?username=${encodeURIComponent(name)}`}>
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

export default function GeneratingPlan({ name, goal, difficulty, duration }) {
  const [isLoading, setIsLoading] = useState(true); // Manage loading state
  const [data, setData] = useState(null); // Manage the data from the backend
  const [error, setError] = useState(null); // Manage error state

  useEffect(() => {
    const postRoadmapData = async () => {
      try {
        const response = await fetch('/api/generate_roadmap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Goal: goal,
            Name: name,
            DifficultyLevel: difficulty,
            TimeSpan: duration,
          }),
        });

        if (response.ok) {
          const fetchedData = await response.json(); // Parse the JSON from the response
          setData(fetchedData); // Set the fetched data
        } else {
          console.error('Error posting data:', response.statusText);
          setError('Failed to generate the roadmap.');
        }
      } catch (error) {
        console.error('Error during POST:', error);
        setError('Error occurred during the request.');
      } finally {
        setIsLoading(false); // Stop loading after the request
      }
    };

    postRoadmapData(); // Call the POST function
  }, [goal, name, difficulty, duration]); // Dependency array includes the props to trigger the POST request

  const handlePuppySelect = (puppyId) => {
    console.log("Puppy selected with ID:", puppyId);
    // Do something when a puppy is selected, e.g., send data to the backend
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
          <p className="font-mono text-3xl text-black mt-8">We are generating your Plan~</p>
        </div>
      ) : error ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4] animate-moveIn">
          <h1 className="font-pixelify text-6xl text-black">Error</h1>
          <p className="font-pixelify text-2xl text-black mt-8">{error}</p>
        </div>
      ) : (
        data ? (
          <PuppySelection onPuppySelect={handlePuppySelect} name={data.name} />
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8eee4] animate-moveIn">
            <h1 className="font-pixelify text-6xl text-black">No Plan Available</h1>
            <p className="font-pixelify text-2xl text-black mt-8">Please try again later.</p>
          </div>
        )
      )}
    </div>
  );
}
