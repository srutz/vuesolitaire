/* (c) Stepan Rutz 2024. All rights reserved. License under the WTFPL */

import { Util } from "./Util"

/* define a playing card in terms of suit and rank */
export type Suit = "hearts" | "diamonds" | "clubs" | "spades"
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K"
export type PlayingCard = {
    suit: Suit
    rank: Rank
    side: Side
}
export type SuitColor = "red" | "black"
export type Side = "front" | "back"

/* a pile type */
export type PileType = "stock" | "waste" | "stack" | "table"

/* a pile of cards */
export type Pile = {
    type: PileType,
    cards: PlayingCard[]
    index: number
}

export type GameStats = {
    points: number
    moves: number
    startTime: number
}

/*
 * Define the SolitaireState type, representing the state of a Solitaire game.
 */
export type SolitaireState = {
    status: "stopped" | "running" | "won" | "launching"
    stats: GameStats,
    stock: Pile     // stock pile, containing the remaining cards.
    waste: Pile     // waste pile, containing the discarded cards.

    stacks: Pile[]  // stacks, where cards are placed in sequence.
    tables: Pile[]   // 7 piles where cards are initially dealt.
}

export function makeDeck() {
    const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"]
    const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    const deck: PlayingCard[] = []
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank, side: "back"})
        }
    }
    return deck    
}

/* Function to create the initial state of a Solitaire game. */
export function makeInitialState() {
    const deck = makeDeck()
    Util.shuffle(deck)

    //console.log("init with " + deck.length + " cards")
    const stock: Pile = { type: "stock", index: -1, cards: [...deck.splice(0, 24)] }
    const waste: Pile = { type: "waste", index: -1, cards: [] }
    const stacks: Pile[] = []
    const tables: Pile[] = []
    for (let i = 0; i < 4; i++) {
        stacks.push({ type: "stack", index: i, cards: [] })
    }
    for (let i = 0; i < 7; i++) {
        tables.push({ type: "table", index: i, cards: deck.splice(0, i + 1) })
    }
    for (let i = 0; i < 7; i++) {
        tables[i].cards[tables[i].cards.length - 1].side = "front"   
    }
    const state: SolitaireState = { 
        status: "stopped",
        stats: { points: 0, moves: 0, startTime: new Date().getTime() },
        stock, waste, tables, stacks }
    return state
}
