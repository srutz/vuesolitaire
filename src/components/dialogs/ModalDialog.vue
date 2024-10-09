<template>
    <ModalBackdrop v-if="show" :opening="!closing">
        <DialogWindow>
            <ModalTitle :title="title" :onClose="handleClosing" />
            <div class="p-4"><slot></slot></div>
            <DialogButtonBar>
                <button @click="handleClosing" class="button">
                    Close
                </button>
            </DialogButtonBar>
        </DialogWindow>
    </ModalBackdrop>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import DialogButtonBar from './DialogButtonBar.vue';
import DialogWindow from './DialogWindow.vue';
import ModalBackdrop from './ModalBackdrop.vue';
import ModalTitle from './ModalTitle.vue';

/* (c) Stepan Rutz 2024. All rights reserved. License under the WTFPL */

/*
 * ModalDialog component, which renders a title and children as content
 * the parent component has to control the visibility of the modal
 * a callback function onClose is called when the close button is clicked
 */


const { show, title, onClose } = defineProps<{
    show: boolean
    title: string
    onClose: () => void
}>()


const closing = ref(false)
const handleClosing = () => {
    closing.value = true
    setTimeout(() => {
        onClose()
        closing.value = false
    }, 250)
}


</script>
