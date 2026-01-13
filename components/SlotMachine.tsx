"use client";

import { RollResult } from "@/lib/types";
import { useState } from "react";

interface SlotDisplayProps {
    symbol: string;
    isSpinning: boolean;
}

export function SlotDisplay({
    symbol,
    isSpinning
}: SlotDisplayProps) {
    return (
        <div className="w-20 h-20 flex items-center justify-center text-2xl font-bold border-2 border-gray-800 rounded-lg bg-gray-200">
            {isSpinning ? "X" : symbol}
        </div>
    );
}

interface SlotMachineProps {
    sessionId: string;
    credits: number;
    onCreditsChange: (credits: number) => void;
}

export function SlotMachine({
    sessionId,
    credits,
    onCreditsChange
}: SlotMachineProps) {
    const [isRolling, setIsRolling] = useState(false);
    const [symbols, setSymbols] = useState<[string, string, string]>(["?", "?", "?"]);
    const [showResult, setShowResult] = useState<[boolean, boolean, boolean]>([false, false, false]);
    const [message, setMessage] = useState("");

    const handleRoll = async () => {
        if (isRolling || credits < 1) return;

        setIsRolling(true);
        setShowResult([false, false, false]);
        setMessage("");

        // spinning animation
        setSymbols(["X", "X", "X"]);

        try {
            const response = await fetch("/api/roll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId })
            });

            if (!response.ok) {
                throw new Error("Failed to roll slots");
            }

            const rollResult: RollResult = await response.json();

            // Reveal symbols one by one
            rollResult.symbols.forEach((symbol, index) => {
                setTimeout(() => {
                    setShowResult(prev => {
                        const next: [boolean, boolean, boolean] = [...prev];
                        next[index] = true;
                        return next;
                    });

                    setSymbols(prev => {
                        const next: [string, string, string] = [...prev];
                        next[index] = symbol;
                        return next;
                    });
                }, (index + 1) * 1000); // +1 second delay for each symbol
            });

            // Show result message after all symbols are revealed
            setTimeout(() => {
                onCreditsChange(rollResult.credits);

                if (rollResult.isWin) {
                    setMessage(`You won ${rollResult.reward} credits!`);
                } else {
                    setMessage("Unlucky... Try again!");
                }

                setIsRolling(false)
            }, 3500); // 500ms after last symbol shows
        } catch (err) {
            console.error("Error rolling: ", err);

            setIsRolling(false)
            setMessage("There was an error rolling the slots. Please try again.");
        } 
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="text-center">
                <h2 className="text-2xl text-black fond-bold mb-2">Credits: {credits}</h2>
                <p className="text-black">
                    {credits < 1 
                        ? "No more credits :("
                        : "Press Roll to try your luck!"}
                </p>
            </div>

            <div className="flex gap-6 text-black bg-gray-600 p-8 rounded shadow">
                {symbols.map((symbol, index) => (
                    <SlotDisplay
                        key={index}
                        symbol={symbol}
                        isSpinning={isRolling && !showResult[index]}
                    />
                ))}
            </div>

            {message && (
                <div className="text-lg text-black font-semibold text-center min-h-6">
                    {message}
                </div>
            )}

            <button
                onClick={handleRoll}
                disabled={isRolling || credits < 1}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-800 disabled:bg-gray-400 cursor-pointer transition-colors"
            >
                {isRolling ? "Rolling..." : "Roll"}
            </button>
        </div>
    );
}