import "server-only";

import { randomUUID } from "crypto";
import { GameSession, Symbol, SymbolRewards } from "./types";

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
export function getRandomSymbol(): Symbol {
    const symbols = Object.values(Symbol);

    return symbols[Math.floor(Math.random() * symbols.length)];
}

export function rollSlots(): [Symbol, Symbol, Symbol] {
    return [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
}

export function checkWin(symbols: [Symbol, Symbol, Symbol]): boolean {
    return symbols[0] === symbols[1] && symbols[1] === symbols[2];
}

export function shouldCheat(credits: number): { shouldCheat: boolean; cheatChance: number; } {
    if (credits < 40) {
        return { shouldCheat: false, cheatChance: 0 };
    }

    if (credits < 60) {
        return { shouldCheat: true, cheatChance: 0.3 };
    }

    return { shouldCheat: true, cheatChance: 0.6 };
}

export function performCheat(
    symbols: [Symbol, Symbol, Symbol],
    cheatChance: number
): [Symbol, Symbol, Symbol] {
    // if random hits, re-roll
    if (Math.random() < cheatChance) {
        return rollSlots();
    }

    return symbols;
}

// had a pretty annoying error here where I forgot to import my custom Symbol so it was using the global Symbol
export function calculateReward(symbols: [Symbol, Symbol, Symbol]): number {
    if (!checkWin(symbols)) return 0;

    return SymbolRewards[symbols[0]];
}