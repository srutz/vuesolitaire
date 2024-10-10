<template>
    <div class="w-32 absolute" :style="style">
        <img draggable="false" class="select-none " :src="imageSource" />
    </div>
</template>
<script setup lang="ts">
import { CSSProperties } from 'vue';

/* simple styled image */

const { style, imageSource } = defineProps<{
    style: CSSProperties,
    imageSource: string,
}>()

</script>
