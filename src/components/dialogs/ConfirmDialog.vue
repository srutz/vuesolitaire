<template>
    <ModalBackdrop v-if="show" :opening="!closing">
        <DialogWindow>
            <ModalTitle :title="title" :onClose="handleCancel" />
            <div class="p-4">
                <slot></slot>
            </div>
            <DialogButtonBar>
                <button @click="handleCancel" class="button button-secondary">
                    Cancel
                </button>
                <button @click="handleConfirm" class="button">
                    Ok
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

/*
* Confirm component, which renders a title and children as content
* the parent component has to control the visibility of the modal
* a callback function onClose is called when the close button is clicked
*/

const { show, title, onCancel, onConfirm } = defineProps<{
    show: boolean
    title: string
    onCancel: () => void
    onConfirm: () => void
}>()

const closing = ref(false)

const handleCancel = () => handleClosing(false)
const handleConfirm = () => handleClosing(true)
const handleClosing = (ok?: boolean) => {
    closing.value = true
    setTimeout(() => {
        ok ? onConfirm() : onCancel()
        closing.value = false
    }, 250)
}

</script>
