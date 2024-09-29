"use client";
import React, { useState } from "react";
import Link from "next/link";

const users = [
  {
    name: "Aditya Kandel",
    streak: 78,
    status: "Improving on Fitness",
    avatar: "/images/friends/Addy.png",
  },
  {
    name: "Selin Kararmaz",
    streak: 38,
    status: "Improving on Drawing",
    avatar: "/images/friends/Selin.png",
  },
  {
    name: "Zijun Ye",
    streak: 12,
    status: "Improving on Running",
    avatar: "/images/friends/Zijun.png",
  },
  {
    name: "Chen Wei",
    streak: 9,
    status: "Improving on Fitness",
    avatar: "/images/friends/Chen.png",
  },
];

export default function Leaderboard() {
  // State to manage button states for each user
  const [buttonStates, setButtonStates] = useState(
    users.map(() => ({
      like: "default",
      heart: "default",
      kudo: "default",
    }))
  );

  const toggleImage = (userIndex, buttonType) => {
    setButtonStates((prevStates) => {
      const newStates = [...prevStates];
      const currentState = newStates[userIndex][buttonType];

      if (currentState === "default") {
        newStates[userIndex][buttonType] = "red"; // First click, turn to red
      } else if (currentState === "red") {
        newStates[userIndex][buttonType] = "black"; // Second click, turn to black
      } else {
        newStates[userIndex][buttonType] = "default"; // Reset to default
      }

      return newStates;
    });
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="">
        <div className="flex">
          <h1 className="flex text-center text-5xl font-bold mb-6 pt-32">
            <Link href="/roadmap">
              <img
                className="w-14 mr-4"
                src="/images/friends/back-button.svg"
                alt="Back button"
              />
            </Link>
            LEADERBOARD
          </h1>
        </div>

        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={index}>
              <div className="flex justify-between items-center p-4 rounded-lg animate-moveIn">
                <div className="flex items-center space-x-4">
                  <div className="">
                    <img
                      className="w-32"
                      src={user.avatar}
                      alt={`${user.name} avatar`}
                    />
                  </div>
                  <div className="pl-10">
                    <div className="text-4xl font-bold">{user.name}</div>
                    <div className="text-gray-500">{user.status}</div>
                    <div className="text-2xl font-bold">
                      Streak: {user.streak}
                    </div>
                  </div>
                </div>

                <div className="pl-20">
                  <div className="flex items-center space-x-4">
                    {/* Like Button */}
                    <button
                      className="bg-white-100 p-2 rounded-full"
                      onClick={() => toggleImage(index, "like")}
                    >
                      <img
                        src={
                          buttonStates[index].like === "red"
                            ? "/images/friends/like-red.png"
                            : buttonStates[index].like === "black"
                            ? "/images/friends/like.png"
                            : "/images/friends/like.png"
                        }
                        alt="Like"
                      />
                    </button>

                    {/* Heart Button */}
                    <button
                      className="bg-white-100 p-2 rounded-full"
                      onClick={() => toggleImage(index, "heart")}
                    >
                      <img
                        src={
                          buttonStates[index].heart === "red"
                            ? "/images/friends/heart-red.png"
                            : buttonStates[index].heart === "black"
                            ? "/images/friends/heart.png"
                            : "/images/friends/heart.png"
                        }
                        alt="Heart"
                      />
                    </button>

                    {/* Kudo Button */}
                    <button
                      className="bg-white-100 p-2 rounded-full"
                      onClick={() => toggleImage(index, "kudo")}
                    >
                      <img
                        src={
                          buttonStates[index].kudo === "red"
                            ? "/images/friends/kudo-red.png"
                            : buttonStates[index].kudo === "black"
                            ? "/images/friends/kudo.png"
                            : "/images/friends/kudo.png"
                        }
                        alt="Kudo"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {index < users.length - 1 && (
                <hr className="border-t-4 border-gray-300 my-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 w-full flex px-10 animate-moveIn">
        <img
          className="w-40 pt-10 animate-move-loop"
          src="/images/moving/rabbit_walking.gif"
          alt="Moving Rabbit"
        />
      </div>
    </div>
  );
}
