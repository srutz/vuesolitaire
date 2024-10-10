import { InjectionKey } from "vue"
import { gameReducer } from "../game/Game"
import { makeInitialState } from "../game/GameTypes"
import { useReducer } from "./Reducer"

/* game context lookup */
export function useGameContext() {
    const r = useReducer(gameReducer, makeInitialState())
    return r
}

export type GameContextType = ReturnType<typeof useGameContext>
export const GameContextTag = Symbol('GameContextTag') as InjectionKey<GameContextType>

