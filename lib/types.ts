export enum Symbol {
    Cherry = "C",
    Lemon = "L",
    Orange = "O",
    Watermelon = "W"
}

export const SymbolRewards: Record<Symbol, number> = {
    [Symbol.Cherry]: 10,
    [Symbol.Lemon]: 20,
    [Symbol.Orange]: 30,
    [Symbol.Watermelon]: 40
};

export interface GameSession {
    id: string;
    credits: number;
    createdAt: Date;
    lastActivityAt: Date;
}

export interface RollResult {
    symbols: [Symbol, Symbol, Symbol];
    isWin: boolean;
    reward: number;
    credits: number;
}

export interface CashOutResult {
    success: boolean;
    amountCashedOut: number;
}