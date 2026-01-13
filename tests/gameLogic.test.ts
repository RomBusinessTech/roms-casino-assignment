import { calculateReward, checkWin, getRandomSymbol, rollSlots, shouldCheat } from "@/lib/gameLogic";
import { Symbol } from "@/lib/types";

describe("Game Logic", () => {
    describe("Symbol Generation", () => {
        it("generate valid symbols", () => {
            const validSymbols = Object.values(Symbol);

            for (let i = 0; i < 10; i++) {
                const symbol = getRandomSymbol();
                expect(validSymbols).toContain(symbol);
            }
        });

        it ("roll 3 symbols", () => {
            const symbols = rollSlots();

            expect(Array.isArray(symbols)).toBe(true);
            expect(symbols).toHaveLength(3);
            expect(Object.values(Symbol)).toContain(symbols[0]);
            expect(Object.values(Symbol)).toContain(symbols[1]);
            expect(Object.values(Symbol)).toContain(symbols[2]);
        });
    });

    describe("Win Detection", () => {
        it("detect matching symbols as win", () => {
            const symbols: [Symbol, Symbol, Symbol] = [Symbol.Cherry, Symbol.Cherry, Symbol.Cherry];

            expect(checkWin(symbols)).toBe(true);
        });

        it("detect non-matching symbols as loss", () => {
            const symbols: [Symbol, Symbol, Symbol] = [Symbol.Cherry, Symbol.Lemon, Symbol.Cherry];

            expect(checkWin(symbols)).toBe(false);
        });

        it("detect 2 matches as loss", () => {
            const symbols: [Symbol, Symbol, Symbol] = [Symbol.Orange, Symbol.Orange, Symbol.Watermelon];

            expect(checkWin(symbols)).toBe(false);
        });
    });

    describe("Reward Calculation", () => {
        it("calculate cherry reward (10)", () => {
            const symbols: [Symbol, Symbol, Symbol] = [Symbol.Cherry, Symbol.Cherry, Symbol.Cherry];

            expect(calculateReward(symbols)).toBe(10);
        });

        it("calculate lemon reward (20)", () => {
            const symbols: [Symbol, Symbol, Symbol] = [Symbol.Lemon, Symbol.Lemon, Symbol.Lemon];

            expect(calculateReward(symbols)).toBe(20);
        });

        it("calculate orange reward (30)", () => {
            const symbols: [Symbol, Symbol, Symbol] = [Symbol.Orange, Symbol.Orange, Symbol.Orange];

            expect(calculateReward(symbols)).toBe(30);
        });

        it("calculate watermelon reward (40)", () => {
            const symbols: [Symbol, Symbol, Symbol] = [Symbol.Watermelon, Symbol.Watermelon, Symbol.Watermelon];

            expect(calculateReward(symbols)).toBe(40);
        });

        it ("0 reward for loss", () => {
            const symbols: [Symbol, Symbol, Symbol] = [Symbol.Cherry, Symbol.Lemon, Symbol.Cherry];

            expect(calculateReward(symbols)).toBe(0);
        });
    });

    describe("House Rules (cheat detection)", () => {
        it("no cheating when credits < 40", () => {
            const result = shouldCheat(30);

            expect(result.shouldCheat).toBe(false);
            expect(result.cheatChance).toBe(0);
        });

        it("cheat with 30% chance when 40 <= credits < 60", () => {
            const result = shouldCheat(50);

            expect(result.shouldCheat).toBe(true);
            expect(result.cheatChance).toBe(0.3);
        });

        it("cheat with 60% chance when credits >= 60", () => {
            const result = shouldCheat(80);

            expect(result.shouldCheat).toBe(true);
            expect(result.cheatChance).toBe(0.6);
        });

        it("edge case at 40 credits", () => {
            const result = shouldCheat(40);

            expect(result.shouldCheat).toBe(true);
            expect(result.cheatChance).toBe(0.3);
        });

        it("edge case at 60 credits", () => {
            const result = shouldCheat(60);

            expect(result.shouldCheat).toBe(true);
            expect(result.cheatChance).toBe(0.6);
        });
    }); 
});