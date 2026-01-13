"use client";

import { SlotMachine } from "@/components/SlotMachine";
import { useEffect, useState } from "react";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
          ) : (
            // I get an error if i don't wrap SlotMachine in <>
            // (Later on i remembered it's because JSX must have a single parent element)
            <> 
            <SlotMachine
              sessionId={sessionId}
              credits={credits}
              onCreditsChange={setCredits}
            />

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
