import { onMounted, onUnmounted, Ref, ref } from "vue"

/* Composable that tracks the size of an element */
export function useElementSize(element: Ref<HTMLElement | null>) {
    const width = ref(0)
    const height = ref(0)
   
    let observer: ResizeObserver | null = null
    const updateSize = (entries: ResizeObserverEntry[]) => {
        const entry = entries[0]
        width.value = entry.contentRect.width
        height.value = entry.contentRect.height
    }

    onMounted(() => {
        observer = new ResizeObserver(updateSize)
        if (element.value) {
            observer.observe(element.value)
        }
    })
    onUnmounted(() => {
        if (observer) {
            observer.disconnect()
        }
    })
    return {
        width,
        height,
    }
}