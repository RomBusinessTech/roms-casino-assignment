import { NextResponse, NextRequest } from "next/server";
import { createSession, getSession, updateSessionActivity } from "@/lib/gameLogic";

export async function POST(request: NextRequest) {
    try {
        const session = createSession();
        updateSessionActivity(session.id);

        return NextResponse.json(
            {
                sessionId: session.id,
                credits: session.credits
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating session: ", err);

        return NextResponse.json(
            { error: "Failed to create session" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        const sessionId = params.get("sessionId");

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

        updateSessionActivity(session.id);

        return NextResponse.json({
            sessionId: session.id,
            credits: session.credits
        });
    } catch (err) {
        console.error("Error fetching session: ", err);

        return NextResponse.json(
            { error: "Failed to fetch session" },
            { status: 500 }
        );
    }
}