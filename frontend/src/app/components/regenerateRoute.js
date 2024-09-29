import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RenerateRoute({ isOpen, onClose }) {
  const [Feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false); // State to handle loading
  const router = useRouter(); // Initialize the router
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set loading to true to show the loading indicator
    setLoading(true);

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
        router.refresh();
        window.location.reload();
      } else if (data.errors) {
        setMessage(data.message);
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An unexpected error occurred");
    } finally {
      // Hide loading state after API call
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFeedback(""); // Clear feedback on cancel
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center animate-moveIn">
            <div className="mt-16">
              <img
                src="/images/house.gif"
                alt="Pixel House"
                className="w-60 h-auto"
              />
            </div>
            <h1 className="font-pixelify text-6xl text-black">Loading...</h1>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Give Us Your Feedback</h2>
            <textarea
              className="font-mono w-full p-2 border border-gray-300 rounded-md text-lg"
              rows="10"
              placeholder="Please give me some feedback about current plan such as difficulty level, feeling, where you dislike/like for better generation."
              value={Feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 flex"
                onClick={handleCancel} // Clear input and close modal on cancel
              >
                <img className="w-6" src="/images/cancel.png" alt="Cancel" />
                CANCEL
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded flex"
                onClick={(e) => {
                  handleSubmit(e); // Submit the form but don't close the modal until API call is done
                }}
              >
                <img
                  className="w-6"
                  src="/images/regenerate.png"
                  alt="Regenerate"
                />
                REGENERATE PLAN
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
