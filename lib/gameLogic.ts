import "server-only";

import { randomUUID } from "crypto";
import { GameSession } from "./types";

// memory store for sessions (in a real app we would use DB / Redis)
const sessions = new Map<string, GameSession>();

/* 
    Session management functions 
*/
export function generateSessionId() {
    // In case we want to change the generation of session IDs later
    return randomUUID();
}

export function createSession(): GameSession {
    const session: GameSession = {
        id: generateSessionId(),
        credits: 10,
        createdAt: new Date(),
        lastActivityAt: new Date()
    };

    sessions.set(session.id, session);

    return session;
}

export function getSession(sessionId: string): GameSession | undefined {
    return sessions.get(sessionId);
}

export function updateSessionCredits(sessionId: string, credits: number): void {
    const session = sessions.get(sessionId);

    if (session) {
        session.credits = credits;
    }
}

export function updateSessionActivity(sessionId: string): void {
    const session = sessions.get(sessionId);

    if (session) {
        // update last activity timestamp
        session.lastActivityAt = new Date();
    }
}

export function deleteSession(sessionId: string): void {
    sessions.delete(sessionId);
}

/*
    Slot machine functions
*/
