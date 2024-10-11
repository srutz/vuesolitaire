import { onMounted, onUnmounted, ref, toRefs } from "vue"

export type WindowSize = { width: number, height: number }

/* Composable that tracks the window size */
export function useWindowSize() {
    const size = ref<WindowSize>({ width: -1, height: -1 })
    onMounted(() => {
        size.value.width = window.innerWidth
        size.value.height = window.innerHeight
        const listener = () => {
            size.value.width = window.innerWidth
            size.value.height = window.innerHeight
        }
        window.addEventListener("resize", listener)
        onUnmounted(() => {
            window.removeEventListener("resize", listener)
        })
    })
    return toRefs(size.value)
}
