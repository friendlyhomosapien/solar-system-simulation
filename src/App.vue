<template>
    <InfoDialogue v-if="showInfoDialogue" data-modal @close="toggleInfoDialogue" />

    <div class="grid grid-cols-3 mt-12 px-4">
        <div class="col-start-2">
            <GlitchEffect class="text-4xl tracking-widest">
                SOLAR
            </GlitchEffect>
        </div>
        <div class="flex flex-col items-end gap-y-4 pointer-events-auto">
            <button
                type="button"
                class="text-gray-100"
                @click="toggleInfoDialogue"
            >
                <InformationCircleIcon
                    class="w-12 h-12 text-current"
                />
            </button>
            <div
                class="flex flex-col items-end gap-y-3"
            >
                <button
                    id="toggle-camera-control"
                    type="button"
                    class="toggle-button"
                >
                    camera control
                </button>
                <button
                    id="toggle-orbit-animate"
                    type="button"
                    class="toggle-button toggle-button--active"
                >
                    orbit toggle
                </button>
            </div>
        </div>
    </div>

    <div
        id="modal"
        ref="modal"
    >
        <div
            v-for="(item, index) in infoItems"
            :key="index"
            class="info-panel"
            :class="{
                'block': selected === item.name
            }"
        >
            <div
                :id="`info-panel__${item.name}__header`"
                class="flex justify-between items-center"
            >
                <h3 class="text-2xl">
                    {{ item.title }}
                </h3>
                <button v-if="item.name === selected" id="modal__close">
                    <XIcon
                        class="h-6 w-6 text-current"
                    />
                </button>
            </div>
            <div
                v-if="item.stats.length && item.stats.length > 0"
                class="mt-4"
            >
                <ul class="space-y-2">
                    <li
                        v-for="(stat, index) in item.stats"
                        :key="index"
                        class="flex"
                    >
                        <span class="w-1/4 font-semibold">
                            {{ stat.name }}
                        </span>
                        <span class="w-3/4">
                            {{ stat.value }}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="grid gap-y-8 mt-10">
                <p
                    v-for="(p, index) in item.description"
                    :key="index"
                >
                    {{ p }}
                </p>
            </div>
        </div>
    </div>

    <nav class="fixed bottom-0 w-full flex justify-center text-gray-100 gap-x-20">
        <button id="prev-planet" type="button" class="p-4 z-10 pointer-events-auto">
            <ChevronLeftIcon class="w-7 h-7 text-current" />
        </button>
        <button id="next-planet" type="button" class="p-4 z-10 pointer-events-auto">
            <ChevronRightIcon class="w-7 h-7 text-current" />
        </button>
    </nav>
</template>
<script>
import GlitchEffect from '!/GlitchEffect/GlitchEffect.vue';
import InfoDialogue from '!/InfoDialogue/InfoDialogue.vue';

import {
    XIcon,
    InformationCircleIcon
} from '@heroicons/vue/solid';

import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/vue/outline';

import infoItems from '@/Assets/SolarInfo.json';

export default {
    components: {
        XIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        InformationCircleIcon,
        GlitchEffect,
        InfoDialogue
    },

    data() {
        return {
            infoItems,
            selected: null,
            showInfoDialogue: false
        }
    },

    mounted() {
        document.addEventListener('click', this.updateSelected);
    },

    methods: {
        updateSelected() {
            if (this.$refs?.modal?.getAttribute('data-info-panel')) {
                this.selected = this.$refs.modal.getAttribute('data-info-panel')
            } else {
                this.selected = null;
            }
        },

        toggleInfoDialogue() {
            this.showInfoDialogue = !this.showInfoDialogue;

            if (this.showInfoDialogue) {
                setTimeout(() => {
                    document.addEventListener('click', this.checkClick)
                }, 100)
            } else {
                setTimeout(() => {
                    document.removeEventListener('click', this.checkClick);
                }, 100);
            }
        },

        checkClick(e) {
            if (e.target.closest("[data-modal]") === null) {
                this.toggleInfoDialogue();
            }
        }
    }
}
</script>

<style lang="postcss">
#modal {
    @apply hidden fixed left-0 top-24 bottom-20 max-h-screen w-screen overflow-y-auto
        sm:w-2/3 lg:w-1/2 2xl:w-1/3 p-4 text-gray-100 z-10;
    direction: rtl;
    pointer-events: auto;
}

#modal[data-info-panel] {
    @apply grid gap-y-4;
}

.info-panel {
    @apply hidden bg-gray-800 bg-opacity-75 p-8 border rounded border-gray-100;
    direction: ltr;
}

button.toggle-button {
    @apply bg-black text-white ring-2 ring-gray-400 rounded px-4 py-2 w-44;
}

button.toggle-button--active {
    @apply ring-2 ring-red-500;
}
</style>
