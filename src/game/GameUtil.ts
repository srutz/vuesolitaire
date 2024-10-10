/* (c) Stepan Rutz 2024. All rights reserved. License under the WTFPL */
import { Pile, PlayingCard, Rank, SolitaireState, Suit, SuitColor } from "./GameTypes"


/* Return type for findClosestPileAndCard */
export type PileInfo = {
    pile: Pile,
    elem: HTMLElement,
    card?: PlayingCard
}

/* utility functions for the game 
 * mostly for finding and manipulating cards and piles by id,
 */
export class GameUtil {

    static ordinalNumber(card: PlayingCard) {
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
        return suitToIndex(card.suit) * 13 + rankToIndex(card.rank)
    }


    static shortSuit(suit: Suit) {
        switch (suit) {
            case "hearts": return "♥"
            case "diamonds": return "♦"
            case "clubs": return "♣"
            case "spades": return "♠"
        }
    }

    static getSuitColor(suit: Suit): SuitColor {
        switch (suit) {
            case "hearts": return "red"
            case "diamonds": return "red"
            case "clubs": return "black"
            case "spades": return "black"
        }
    }

    static cardToString(card?: PlayingCard) {
        return card && `${GameUtil.shortSuit(card.suit)}-${card.rank}`
    }

    static cardId(card: PlayingCard) {
        return `${card.suit.substring(0, 1)}_${card.rank}`
    }

    static cardToImage(card: PlayingCard) {
        let rank = card.rank as string;
        if (rank === "10") rank = "0"
        //return `https://deckofcardsapi.com/static/img/${rank.toUpperCase()}${card.suit[0].toUpperCase()}.png`
        return `/vuesolitaire/cards/${rank.toUpperCase()}${card.suit[0].toUpperCase()}.svg`
    }

    static findCardElement(element: HTMLElement) {
        while (element) {
            const v = element.getAttribute('data-card')
            if (v && v.length > 0) {
                return element
            }
            element = element.parentElement as HTMLElement
        }
        return null;
    }

    static indexOfCard(cards: PlayingCard[], card: PlayingCard) {
        return cards.findIndex(c => GameUtil.cardId(c) == GameUtil.cardId(card))
    }

    static removeCard(cards: PlayingCard[], card: PlayingCard) {
        const index = this.indexOfCard(cards, card)
        if (index !== -1) {
            cards.splice(index, 1)
        }
        return cards
    }

    static findCardById(state: SolitaireState, id: string | null) {
        if (!id) {
            return undefined
        }
        {
            const card = state.stock.cards.find(c => GameUtil.cardId(c) == id)
            if (card) {
                return card
            }
        }
        {
            const card = state.waste.cards.find(c => GameUtil.cardId(c) == id)
            if (card) {
                return card
            }
        }
        for (const pile of state.stacks) {
            const card = pile.cards.find(c => GameUtil.cardId(c) == id)
            if (card) {
                return card
            }
        }
        for (const pile of state.tables) {
            const card = pile.cards.find(c => GameUtil.cardId(c) == id)
            if (card) {
                return card
            }
        }
        return undefined
    }

    static pileId(pile: Pile) {
        let id = pile.type
        if (pile.index != null && pile.index >= 0) {
            id += "_" + pile.index
        }
        return id
    }

    static findPileById(state: SolitaireState, id: string | null) {
        if (!id) {
            return undefined
        }
        if (GameUtil.pileId(state.stock) == id) {
            return state.stock
        }
        if (GameUtil.pileId(state.waste) == id) {
            return state.waste
        }
        for (const pile of state.stacks) {
            if (GameUtil.pileId(pile) == id) {
                return pile
            }
        }
        for (const pile of state.tables) {
            if (GameUtil.pileId(pile) == id) {
                return pile
            }
        }
        return undefined
    }

    static pileHasCard(pile: Pile, card: PlayingCard) {
        return pile.cards.findIndex(c => GameUtil.cardId(c) == GameUtil.cardId(card)) != -1
    }

    static hasCard(cards: PlayingCard[], card: PlayingCard) {
        return cards.findIndex(c => GameUtil.cardId(c) == GameUtil.cardId(card)) != -1
    }

    static hasCardById(cards: PlayingCard[], cardId: string) {
        return cards.findIndex(c => GameUtil.cardId(c) == cardId) != -1
    }

    static findPileForCard(state?: SolitaireState, card?: PlayingCard) {
        if (!state || !card) {
            return undefined
        }
        if (GameUtil.pileHasCard(state.stock, card)) {
            return state.stock
        }
        if (GameUtil.pileHasCard(state.waste, card)) {
            return state.waste
        }
        for (const pile of state.stacks) {
            if (GameUtil.pileHasCard(pile, card)) {
                return pile
            }
        }
        for (const pile of state.tables) {
            if (GameUtil.pileHasCard(pile, card)) {
                return pile
            }
        }
        return undefined
    }

    static intersectRect(r1: DOMRect, r2: DOMRect) {
        return !(
            r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top)
    }

    static distanceBetweenCenters(p1: DOMRect, p2: DOMRect) {
        const x1 = p1.left + p1.width / 2
        const y1 = p1.top + p1.height / 2
        const x2 = p2.left + p2.width / 2
        const y2 = p2.top + p2.height / 2
        const dx = x1 - x2
        const dy = y1 - y2
        return Math.sqrt(dx * dx + dy * dy)
    }

    /* find the closest pile to the target element
     * target is the element being dragged around
     */
    static findClosestPile(state: SolitaireState, container: HTMLDivElement, target: HTMLElement): PileInfo | undefined {
        //console.log("dragrect: " + dragrect.left + " " + dragrect.top + " " + dragrect.right + " " + dragrect.bottom)
        const dragrect = target.getBoundingClientRect()
        let candidate: PileInfo | undefined = undefined
        let dist = Number.MAX_VALUE
        container.querySelectorAll("[data-pile]").forEach(e => {
            if (!(e instanceof HTMLElement)) {
                return
            }
            const elem = e as HTMLElement
            const pilerect = elem.getBoundingClientRect()
            const pileId = elem.getAttribute("data-pile")
            const pile = GameUtil.findPileById(state, pileId)
            if (!pile) {
                return
            }
            if (GameUtil.intersectRect(dragrect, pilerect)) {
                const currdist = GameUtil.distanceBetweenCenters(dragrect, pilerect)
                if (currdist < dist) {
                    dist = currdist
                    candidate = { pile, elem }
                }
            }
        })
        return candidate
    }

    /* find the closest pile and Card to the target element
     * target is the element being dragged around
     */
    static findClosestPileAndCard(state: SolitaireState, container: HTMLDivElement, target: HTMLElement, draggedCard?: PlayingCard): PileInfo | undefined {
        //console.log("dragrect: " + dragrect.left + " " + dragrect.top + " " + dragrect.right + " " + dragrect.bottom)
        const dragrect = target.getBoundingClientRect()
        let candidate: PileInfo | undefined = undefined
        let dist = Number.MAX_VALUE
        container.querySelectorAll("[data-card]").forEach(e => {
            if (!(e instanceof HTMLElement)) {
                return
            }
            const elem = e as HTMLElement
            if (elem == target) {
                return
            }
            if (!draggedCard) {
                return
            }
            const cardrect = elem.getBoundingClientRect()
            const cardId = elem.getAttribute("data-card")
            const card = GameUtil.findCardById(state, cardId)
            if (!card) {
                return
            }
            const cardPile = GameUtil.findPileForCard(state, card)
            const draggedPile = GameUtil.findPileForCard(state, draggedCard)
            if (card != draggedCard && draggedPile && draggedPile == cardPile) {
                const cardIndex = GameUtil.indexOfCard(cardPile.cards, card)
                const draggedIndex = GameUtil.indexOfCard(cardPile.cards, draggedCard)
                if (cardIndex > draggedIndex) {
                    return
                }
            }
            if (GameUtil.intersectRect(dragrect, cardrect)) {
                const currdist = GameUtil.distanceBetweenCenters(dragrect, cardrect)
                if (currdist < dist) {
                    dist = currdist
                    if (cardPile) {
                        candidate = { pile: cardPile, elem, card }
                    }
                }
            }
        })
        if (!candidate) {
            candidate = GameUtil.findClosestPile(state, container, target)
        }
        return candidate
    }

    /* if you drag a card from a table pile you drag along all the cards on top of it 
     * (top means vertically below)
     */
    static computeAllDraggedCards(state: SolitaireState, card: PlayingCard) {
        if (!card) {
            return []
        }
        const r: PlayingCard[] = []
        const pile = GameUtil.findPileForCard(state, card)
        if (pile?.type == "table") {
            const index = GameUtil.indexOfCard(pile.cards, card)
            if (index != -1) {
                for (let i = index, n = pile.cards.length; i < n; i++) {
                    r.push(pile.cards[i])
                }
            }
        } else {
            r.push(card)
        }
        return r
    }

    static getAllCards(state: SolitaireState) {
        return state.stock.cards.concat(state.waste.cards).concat(
            state.stacks.flatMap(p => p.cards)).concat(
                state.tables.flatMap(p => p.cards))
    }

}
