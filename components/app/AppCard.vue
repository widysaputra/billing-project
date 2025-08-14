<template>
    <Card :style="cardStyle" :class="cardClass">
        <!-- Header slot - bisa berisi gambar atau konten custom -->
        <template #header v-if="$slots.header || headerImage">
            <slot name="header">
                <img v-if="headerImage" :alt="headerImageAlt" :src="headerImage" />
            </slot>
        </template>

        <!-- Title slot -->
        <template #title v-if="$slots.title || title">
            <slot name="title">{{ title }}</slot>
        </template>

        <!-- Subtitle slot -->
        <template #subtitle v-if="$slots.subtitle || subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
        </template>

        <!-- Content slot -->
        <template #content v-if="$slots.default || content">
            <slot>
                <p v-if="content" class="m-0">{{ content }}</p>
            </slot>
        </template>

        <!-- Footer slot -->
        <template #footer v-if="$slots.footer || showDefaultFooter">
            <slot name="footer">
                <div v-if="showDefaultFooter" class="flex gap-4 mt-1">
                    <Button 
                        :label="cancelLabel" 
                        severity="secondary" 
                        outlined 
                        class="w-full bg-rose-500 hover:bg-rose-600 text-white"
                        @click="$emit('cancel')"
                        v-if="showCancelButton"
                    />
                    <Button 
                        :label="saveLabel" 
                        class="w-full bg-teal-500 hover:bg-teal-600 text-white"
                        @click="$emit('save')"
                        v-if="showSaveButton"
                    />
                </div>
            </slot>
        </template>
    </Card>
</template>

<script setup>
// Props untuk kustomisasi
const props = defineProps({
    width: { type: String, default: '28rem' },
    cardClass: { type: String, default: ''},
    headerImage: { type: String, default: ''},
    headerImageAlt: { type: String, default: 'header image'},
    title: {type: String, default: ''},
    subtitle: {type: String, default: ''},
    content: { type: String, default: ''},
    showDefaultFooter: { type: Boolean, default: false},
    showCancelButton: { type: Boolean, default: true },
    showSaveButton: { type: Boolean, default: true },
    cancelLabel: { type: String, default: 'Cancel' },
    saveLabel: { type: String, default: 'Save' }
})

// Events
const emit = defineEmits(['cancel', 'save'])

// Computed untuk style
const cardStyle = computed(() => {
    return `width: ${props.width}; overflow: hidden`
})
</script>
