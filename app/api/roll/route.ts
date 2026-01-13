import { calculateReward, checkWin, getSession, performCheat, rollSlots, shouldCheat, updateSessionActivity, updateSessionCredits } from "@/lib/gameLogic";
import { RollResult } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json(
                { error: "Missing sessionId" },
                { status: 400 }
            );
        }

        const session = getSession(sessionId);

        if (!session) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        // Check if user is not broke
        if (session.credits < 1) {
            return NextResponse.json(
                { error: "Not enough credits to roll" },
                { status: 400 }
            );
        }

        // Roll logic
        let symbols = rollSlots();
        const initialWin = checkWin(symbols);

        // House rules :)
        if (initialWin) {
            const { shouldCheat: cheat, cheatChance } = shouldCheat(session.credits);

            if (cheat) {
                symbols = performCheat(symbols, cheatChance);
            }
        }

        // Final results
        const isWin = checkWin(symbols);
        const reward = calculateReward(symbols);

        // Update credits
        let newCredits = session.credits - 1;

        if (isWin) {
            newCredits += reward;
        }

        updateSessionCredits(sessionId, newCredits);
        updateSessionActivity(sessionId);

        const result: RollResult = {
            symbols,
            isWin,
            reward,
            credits: newCredits
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("Error processing roll: ", err);

        return NextResponse.json(
            { error: "Failed to process roll" },
            { status: 500 }
        );
    }
}