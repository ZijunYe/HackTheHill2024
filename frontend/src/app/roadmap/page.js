"use client";
import RoadAnimation from "../components/roadAnimation";
import IconLinks from "../component/listIcons";
import Score from "../component/Score";
import { useState, useEffect } from "react";

export default function RoadMap() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data on the client side
    async function fetchData() {
      const res = await fetch("/api/get_username ");
      const result = await res.json();
      console.log(result["Name"]);
      setUsername(result["Name"]);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-row min-h-screen">
      <Score></Score>
      <RoadAnimation></RoadAnimation>
      <h1 className="text-6xl mr-10 W-20">Hello,{username}</h1>
      <IconLinks></IconLinks>
    </div>
  );
}
