"use client";

import { SlotMachine } from "@/components/SlotMachine";
import { useEffect, useState } from "react";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cashing, setCashing] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);

  useEffect(() => {
    startSession();
  }, []);

  const startSession = async () => {
    try {
      const response = await fetch("/api/session", {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Failed to start session");
      }

      const data = await response.json();

      setSessionId(data.sessionId);
      setCredits(data.credits);
      setIsLoading(false);
    } catch (err) {
      console.error("Error starting session: ", err);

      // Show the user an error message
      setError("Failed to start session, Try again later.");
      setIsLoading(false);
    }
  };

  const handleCashOut = async () => {
    setCashing(true);

    try {
      const response = await fetch("/api/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        throw new Error("Failed to cash out");
      }

      const data = await response.json();
      setCashedOut(true);
      alert(`Successfully cashed out ${data.amountCashedOut} credits!`);
    } catch (err) {
      console.error("Error cashing out: ", err);
      alert("Failed to cash out, try again later.")
    } finally {
      setCashing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
            Rom's Casino
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Good luck, you'll need it.
          </p>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading your session...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={startSession}
                className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-800 cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : cashedOut ? (
            <div className="text-center py-12">
              <p className="text-2xl font-bold text-gray-600 mb-4">
                Session Ended
              </p>
              <p className="text-gray-600 mb-6">
                You have successfully cashed out {credits} credits.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                New Session
              </button>
            </div>
          ) : (
            // I get an error if i don't wrap SlotMachine in <>
            // (Later on i remembered it's because JSX must have a single parent element)
            <> 
            <SlotMachine
              sessionId={sessionId}
              credits={credits}
              onCreditsChange={setCredits}
            />

            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={handleCashOut}
                disabled={cashing || credits === 0}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 disabled:bg-gray-400 cursor-pointer transition-colors"
              >
                {cashing ? "Processing..." : `Cash Out ${credits}`}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
              <p className="font-semibold mb-2">How to use the slot machine:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Start with 10 credits. Each roll costs 1 credit</li>
                <li>Match 3 symbols to win: Cherry (10), Lemon (20), Orange (30), Watermelon (40)</li>
                <li>Cash out anytime to collect your winnings</li>
              </ul>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
