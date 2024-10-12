<template>
    <div class="gridcontainer" :style="styleContainer()">
        <div v-for="(tile) in tiles" :key="tile.id" :data-id="tile.id" class="gridtile rounded-sm" :style="styleTile(tile)" ></div>
    </div>
</template>

<style scoped>

.gridcontainer {
    position: relative;
    background-color: black;
    transition: all 250ms ease-in-out;
}

.gridtile {
    position: absolute;
    background-repeat: no-repeat;
    transition: all 250ms ease-in-out;
    transition-timing-function: cubic-bezier(1, -0.6, 0.61, 1.37);
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, type CSSProperties } from 'vue';
import { Util } from '../game/Util';


const mounted = ref(false)

type Tile = {
    id: number
    index: number // index in the image (image rect)
    order: number // order in which the tiles are displayed
}

const rows = 10
const cols = 10

const width = 640
const height = 640
const gap = ref(1)

const tilewidth = width / cols
const tileheight = height / rows
const flipped = ref(false)
const shortDelay = ref(true)
const images = [
    "https://images.pexels.com/photos//1679602/pexels-photo-1679602.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1",
    "https://images.pexels.com/photos/279009/pexels-photo-279009.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1",
    "https://images.pexels.com/photos/39018/cards-jass-cards-card-game-strategy-39018.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1",
]
const imageIndex = ref(1)

/* make the tiles */
const tiles = ref(Array.from(Array(rows * cols).keys()).map(i => (
    {
        id: i + 1,
        index: i, 
        order: i, 
    } satisfies Tile)))

/* get the style for a tile, the order changes during the animation */
const styleTile = (tile: Tile) => {
    const sx = tile.order % cols
    const sy = Math.floor(tile.order / cols)
    const tx = tile.index % cols
    const ty = Math.floor(tile.index / cols)
    const m = mounted.value
    const delay = shortDelay.value ? tile.order * 10 : tile.order * 25
    const angle = flipped.value ? 90 : 0
    return {
        left: m ? (sx * (tilewidth + gap.value)) + 'px' : (width / 2 - tilewidth / 2) + 'px',
        top:  m ? (sy * (tileheight + gap.value)) + 'px' : (height / 2 - tileheight / 2) + 'px',
        width: tilewidth + 'px',
        height: tileheight + 'px',
        backgroundPosition: `-${tx * tilewidth}px -${ty * tileheight}px`,
        backgroundSize: `${width}px ${height}px`,
        transform: `rotateX(${angle}deg)`,
        transitionDelay: `${delay}ms`,
        backgroundImage: `url('${images[imageIndex.value]}')`,
    } satisfies CSSProperties
}

/* get the style for the container */
const styleContainer = () => {
    return {
        width: (width + (cols - 1) * gap.value) + 'px',
        height: (height + (rows - 1) * gap.value) + 'px',
        gap: gap + 'px',
    } satisfies CSSProperties
}

const animationCounter = ref(0)
onMounted(() => {
    setTimeout(() => {
        mounted.value = true
    }, 100)
    const timer = setInterval(() => {
        const newTiles = [...tiles.value]
        const order = Array.from(Array(tiles.value.length).keys()).map(i => i)
        if (animationCounter.value % 3 == 0) {
            gap.value= 1
            flipped.value = false
            shortDelay.value = true
        } else if (animationCounter.value % 3 == 1) {
            flipped.value = true
            shortDelay.value = false
            imageIndex.value = (imageIndex.value + 1) % images.length
        } else if (animationCounter.value % 3 == 2) {
            flipped.value = false
            shortDelay.value = true
            Util.shuffleRows(order)
            gap.value= 12
        }
        newTiles.forEach((tile, i) => {
            tile.order = order[i]
        })
        tiles.value = newTiles
        animationCounter.value++
    }, 3_000)
    onUnmounted(() => {
        clearInterval(timer)
        mounted.value = false
    })
})

</script>
