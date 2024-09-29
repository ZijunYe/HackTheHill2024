import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RenerateRoute({ isOpen, onClose }) {
  const [Feedback, setFeedback] = useState("");
  const router = useRouter(); // Initialize the router
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/update_roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Feedback }), // Include feedback
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        console.log(response);
        // Navigate to /roadmap page
        router.push("/roadmap");
      } else if (data.errors) {
        setErrors(data.errors);
        setMessage(data.message);
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An unexpected error occurred");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full ">
        <h2 className="text-2xl font-bold mb-4">Give Us Your Feedback</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md text-lg"
          rows="10"
          placeholder="Please give me some feedback about current plan such as difficulty level, feeling, where you dislike/like for better generation."
          value={Feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 flex"
            onClick={onClose}
          >
            <img className="w-6" src="/images/cancel.png"></img>
            CANCEL
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded flex"
            onClick={(e) => {
              console.log(Feedback);
              onClose();
              handleSubmit(e);
            }}
          >
            <img className="w-6" src="/images/regenerate.png"></img>
            REGENERATE PLAN
          </button>
        </div>
      </div>
    </div>
  );
}
