import { deleteSession, getSession } from "@/lib/gameLogic";
import { CashOutResult } from "@/lib/types";
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

        const amountCashedOut = session.credits;

        // in a real app, we'd transfer credits to user's account
        deleteSession(sessionId);

        const result: CashOutResult = {
            success: true,
            amountCashedOut
        };

        return NextResponse.json(result);
    } catch (err) {
        console.error("Error cashing out: ", err);

        return NextResponse.json(
            { error: "Failed to process cashout" },
            { status: 500 }
        );
    }
}