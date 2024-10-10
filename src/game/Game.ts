/* (c) Stepan Rutz 2024. All rights reserved. License under the WTFPL */
import { makeInitialState, Pile, PlayingCard, Rank, Side, SolitaireState, Suit } from "./GameTypes"
import { GameUtil } from "./GameUtil"


/* helper to convert suit to index */
function suitToIndex(suit: Suit) {
    switch (suit) {
        case "clubs": return 0
        case "spades": return 1
        case "hearts": return 2 
        case "diamonds": return 3
    }
}

/* helper to convert rank to index */
function rankToIndex(rank: Rank) {
    const a = rank == "10" ? "0" : rank
    return "A234567890JQK".indexOf(a)
}

function stackMoveAllowed(stack: Pile, card: PlayingCard) {
    if (stack.cards.length == 0) {
        if (card.rank == "A") {
            return true
        }
    } else {
        const topCard = stack.cards[stack.cards.length - 1]
        if (topCard.suit == card.suit) {
            const currRankIndex = rankToIndex(card.rank)
            const topRankIndex = rankToIndex(topCard.rank)
            if (currRankIndex == topRankIndex + 1) {
                return true
            }
        }
    }
    return false
}

function tableMoveAllowed(table: Pile, card: PlayingCard) {
    if (table.cards.length == 0) {
        return true
    } else {
        const topCard = table.cards[table.cards.length - 1]
        if (GameUtil.getSuitColor(topCard.suit) != GameUtil.getSuitColor(card.suit)) {
            const currRankIndex = rankToIndex(card.rank)
            const topRankIndex = rankToIndex(topCard.rank)
            if (currRankIndex == topRankIndex - 1) {
                return true
            }
        }
    }
    return false
}

function checkForWin(s: SolitaireState, countMove: boolean) {
    let completeStacks = 0
    const deckSize = s.stock.cards.length + s.waste.cards.length
        + s.tables.reduce((acc, p) => acc + p.cards.length, 0)
        + s.stacks.reduce((acc, p) => acc + p.cards.length, 0)
    for (const stack of s.stacks) {
        if (stack.cards.length == Math.floor(deckSize / 4)) {
            completeStacks++
        }
    }
    if (completeStacks == 4) {
        s.status = "won"
    }
    if (countMove) {
        s.stats.moves++
    }
}

export type FragementState = Pick<SolitaireState, "stats" | "stock" | "waste" | "stacks" | "tables">

export type GameAction =
    | { type: "game-new" }
    | { type: "game-launched" }
    | { type: "game-stop" }
    | { type: "game-reset", stateFragment: FragementState }
    | { type: "draw-stock"; card: PlayingCard }
    | { type: "draw-waste"; card: PlayingCard }
    | { type: "draw-table"; card: PlayingCard, side: Side }
    | { type: "drop-table"; cards: PlayingCard[]; table: Pile }
    | { type: "empty-stock"; }
    ;

export const gameReducer = (state: SolitaireState, action: GameAction) => {
    //console.log("action: " + action.type)
    switch (action.type) {
        case "game-new": {
            const s = makeInitialState()
            s.status = "launching"
            return s
        }
        case "game-launched": {
            const s = { ...state }
            s.status = "running"
            return s
        }
        case "game-stop": {
            const s = { ...state }
            s.status = "stopped"
            return s
        }
        case "game-reset": {
            /* reset to the state given in the action */
            const s = makeInitialState()
            s.status = "running"
            s.stock = action.stateFragment.stock
            s.waste = action.stateFragment.waste
            s.stacks = action.stateFragment.stacks
            s.tables = action.stateFragment.tables
            s.stats = action.stateFragment.stats
            return s
        }
        case "draw-stock": {
            const s = { ...state }
            const stockIndex = s.stock.cards.findIndex(c => GameUtil.cardId(c) == GameUtil.cardId(action.card))
            let moveAllowed = false
            if (stockIndex != -1 && stockIndex == s.stock.cards.length - 1) {
                s.stock.cards.splice(stockIndex, 1)
                action.card.side = "front"
                s.waste.cards.push(action.card)
                moveAllowed = true
            }
            checkForWin(s, moveAllowed)
            return s
        }
        case "empty-stock": {
            const s = { ...state }
            if (s.stock.cards.length == 0) {
                s.stock.cards = s.waste.cards
                s.stock.cards.reverse()
                s.stock.cards.forEach(c => c.side = "back")
                s.waste.cards = []
                s.stats.points -= 15
            }
            checkForWin(s, true)
            return s
        }
        case "draw-waste": {
            const s = { ...state }
            const wasteIndex = s.waste.cards.findIndex(c => GameUtil.cardId(c) == GameUtil.cardId(action.card))
            let moveAllowed = false
            if (wasteIndex != -1 && wasteIndex == s.waste.cards.length - 1) {
                /* try to put on stack */
                const destinationStackIndex = suitToIndex(action.card.suit)
                const destinationStack = s.stacks[destinationStackIndex]
                moveAllowed = stackMoveAllowed(destinationStack, action.card)
                if (moveAllowed) {
                    s.waste.cards.splice(wasteIndex, 1)
                    destinationStack.cards.push(action.card)
                    s.stats.points += 10
                }
            }
            checkForWin(s, moveAllowed)
            return s
        }
        /* draw from a table, try to put "card" onto a stack if its the card's turn */
        case "draw-table": {
            const s = { ...state }
            const table = GameUtil.findPileForCard(s, action.card)
            let moveAllowed = false
            if (table) {
                const tableIndex = table.cards.findIndex(c => GameUtil.cardId(c) == GameUtil.cardId(action.card))
                if (tableIndex != -1 && tableIndex == table.cards.length - 1) {
                    // tableCard is reactive, action.card is not
                    const tableCard = table.cards[tableIndex]
                    if (tableCard.side == "back" && tableCard.side == "back") {
                        tableCard.side = "front"
                        s.stats.points += 10
                        moveAllowed = true
                    } else if (action.side == "front") {
                        /* try to put on stack */
                        const destinationStackIndex = suitToIndex(action.card.suit)
                        const destinationStack = s.stacks[destinationStackIndex]
                        moveAllowed = stackMoveAllowed(destinationStack, action.card)
                        if (moveAllowed) {
                            table.cards.splice(tableIndex, 1)
                            destinationStack.cards.push(action.card)
                            //s.stats.points += 10
                        }
                    }
                }
            }
            checkForWin(s, moveAllowed)
            return s
        }
        /* dropping several "cards" onto a table */
        case "drop-table": {
            console.assert(action.table?.type == "table", "drop-table: pile is not a table")
            const s = { ...state }
            const card = action.cards[0]
            const pile = GameUtil.findPileForCard(s, card)
            let moveAllowed = false
            if (pile && pile != action.table && action.cards.length > 0) {
                moveAllowed = tableMoveAllowed(action.table, action.cards[0])
                if (moveAllowed) {
                    for (let i = 0; i < action.cards.length; i++) {
                        const curr = action.cards[i]
                        GameUtil.removeCard(pile.cards, curr)
                        action.table.cards.push(curr)
                        if (pile.type == "stack") {
                            s.stats.points -= 5
                        }
                    }
                }
            }
            checkForWin(s, moveAllowed)
            return s
        }
        default:
            throw new Error()
    }
}

