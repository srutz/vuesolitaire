import { ref } from "vue"

/*
 * this is a reducer composable like the useReducer hook in React
 *
 * State and Action are generic types. 
 */
export function useReducer<State,Action>(reducer: (state: State, action: Action) => State, initialState: State) {
    const state = ref(initialState)
    const dispatch = (action: Action) => {
        state.value = reducer(state.value, action)
    }
    return { state, dispatch }
}
