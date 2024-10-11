import Pako from "pako";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FragementState } from "../game/Game";
import { SolitaireState } from "../game/GameTypes";
import { GameContextType } from "./GameContext";

export function useUrlState(gameContext: GameContextType) {
    const route = useRoute()
    const router = useRouter()
    const restoringState = ref(false)
    const previousState = ref("")
    const state = gameContext.state
 
    /* the idea is to keep the game's state in sync with the URL 
     * so that you can bookmark the game and restore it later
     * or share the game with others. Also you can use the history
     * back and forward functionality of the browser to undo and redo
     * moves.
     * 
     * The state is stored in the URL as a compressed JSON string.
     */

    /* capture the state of the game in the url */
    watch([ state ], () => {
        if (restoringState.value) {
            return
        }
        if (gameContext.state.value.status === "running") {
            /* here we could optimize the user experience by only updating the URL
             * if the state has changed "enough"
             * we can compare to the previous state and only update the URL if
             * the difference is big enough.
             */
            const externalForm = stateToExternalForm(state.value)
            const stateEquals = externalForm == previousState.value
            // uncomment to track state changes in the console
            //if (previousState.current) console.log("old state: ", JSON.parse(Pako.ungzip(urlsafe2data(previousState.current), { to: "string" }))) }
            //console.log("new state: ", JSON.parse(Pako.ungzip(urlsafe2data(externalForm), { to: "string" })))
            if (!stateEquals) {
                router.push({ 
                    name: 'vuesolitaire',
                    query: { s: externalForm }
                })
            }
            previousState.value = externalForm
        } else {
            router.push({ 
                name: 'vuesolitaire',
                query: { }
            })
        }

    })

    /* this effect is for applying the state. the user just navigates to a link
     * and the state is restored from the URL by this effect
     * this should happen only when the searchParams change and not when the state changes
     */
    watch([ route ], () => {
        const query = route.query
        const externalstate = query.s?.toString()
        if (externalstate && externalstate != stateToExternalForm(state.value)) {
            const r = urlsafe2data(externalstate)
            const raw = Pako.ungzip(r, { to: "string" })
            const fragment = JSON.parse(raw) as FragementState
            restoringState.value = true
            gameContext.dispatch({ type: "game-reset", stateFragment: fragment })
            setTimeout(() => {
                restoringState.value = false
            }, 1)
        }
    }, {
        immediate: true
    }) /* careful here, this effect watches the searchParams */

}



/* convert a url-safe string to a byte array */
function urlsafe2data(base64String: string) {
    base64String = base64String.replace(/-/g, '+').replace(/_/g, '/')
    while (base64String.length % 4) {
        base64String += '='
    }
    const binaryString = atob(base64String)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
}


/* take the solitaire state and convert it to a url-safe string */
export function stateToExternalForm(s: SolitaireState) {
    const e = {
        stock: s.stock,
        waste: s.waste,
        stacks: s.stacks,
        tables: s.tables,
        stats: s.stats,
    }
    const external = JSON.stringify(e)
    const r = Pako.gzip(external)
    const urldata = data2urlsafe(r)
    return urldata
}


/* convert a byte array to a url-safe string */
function data2urlsafe(bytes: Uint8Array) {
    let base64String = btoa(String.fromCharCode(...bytes))
    base64String = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return base64String
}


