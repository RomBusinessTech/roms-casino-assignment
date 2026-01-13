import { createSession, deleteSession, getSession, updateSessionCredits } from "@/lib/gameLogic";

describe("Session Management", () => {
    it("create a session with 10 credits", () => {
        const session = createSession();

        expect(session.id).toBeDefined();
        expect(session.credits).toBe(10);
        expect(session.createdAt).toBeInstanceOf(Date);
        expect(session.lastActivityAt).toBeInstanceOf(Date);
    });

    it("retrieve a created session", () => {
        const created = createSession();
        const retrieved = getSession(created.id);

        expect(retrieved).toBeDefined();
        expect(retrieved?.id).toBe(created.id);
        expect(retrieved?.credits).toBe(10);
    });

    it("update session credits", () => {
        const session = createSession();
        updateSessionCredits(session.id, 20);

        const updated = getSession(session.id);
        expect(updated?.credits).toBe(20);
    });

    it("delete a session", () => {
        const session = createSession();
        deleteSession(session.id);

        const deleted = getSession(session.id);
        expect(deleted).toBeUndefined();
    });

    it("return undefined for incorrect session ID", () => {
        const session = getSession("unreal-id");
        
        expect(session).toBeUndefined();
    });
});