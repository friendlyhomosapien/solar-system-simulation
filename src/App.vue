<template>
    <Teleport
        to="body"
    >
        <button
            type="button"
            class="absolute top-8 right-8 text-gray-100"
            @click="toggleDialog"
        >
            <InformationCircleIcon
                class="w-12 h-12 text-current"
            />
        </button>

        <dialog
            ref="infoDialog"
            class="p-8 bg-gray-800 text-gray-100 rounded border-2 border-gray-100
                w-full md::w-3/4 lg:w-1/2 2xl:w-1/3 mt-12"
        >
            <div
                class="flex flex-col sm:flex-row justify-between
                    items-start sm:items-center gap-y-6 pb-4 border-b-2 border-gray-100"
            >
                <GlitchEffect class="text-4xl tracking-widest">
                    SOLAR
                </GlitchEffect>
                <span class="flex items-center gap-x-4">
                    <button
                        id="toggle-camera-control"
                        type="button"
                        class="bg-black text-gray-100 rounded px-4 py-2"
                    >
                        camera control
                    </button>
                    <button
                        id="toggle-orbit-animate"
                        type="button"
                        class="bg-black text-gray-100 rounded px-4 py-2"
                    >
                        orbit toggle
                    </button>
                    <button @click="toggleDialog" type="button">
                        <XIcon
                            class="h-6 w-6 text-gray-100"
                        />
                    </button>
                </span>
            </div>
            <div class="space-y-2 mt-6">
                <p>Thankyou for visiting my solar simulation project!</p>
                <p>
                    By clicking on a planet or the sun information about the object will be shown on screen.
                    It's also possible to navigate between planets by using the arrows shown in the information modal
                </p>
                <p>
                    The planets have been scaled relative to earth.
                    They are not scaled relative to the sun because it would make them too small to see.
                </p>
                <p>You can stop the planets from orbitting by clicking on 'orbit toggle'.</p>
                <p>To enable camera control over the camera's position click 'camera control'</p>
            </div>
        </dialog>
    </Teleport>
    <div
        id="modal"
        ref="modal"
    >
        <nav class="flex justify-between text-gray-100 ltr">
            <button id="prev-planet" type="button" class="p-4">
                <ChevronLeftIcon class="w-7 h-7 text-current" />
            </button>
            <button id="next-planet" type="button" class="p-4">
                <ChevronRightIcon class="w-7 h-7 text-current" />
            </button>
        </nav>
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
</template>
<script>
import GlitchEffect from '!/GlitchEffect/GlitchEffect.vue';

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
        GlitchEffect
    },
    data() {
        return {
            infoItems,
            selected: null,
            projectInfoDialog: false
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
        toggleDialog() {
            this.projectInfoDialog = !this.projectInfoDialog;
            const checkClickOutside = (e) => {
                if (e.target === this.$refs.infoDialog) {
                    this.$refs.infoDialog.close();
                }
            }
            if (!this.$refs.infoDialog.open) {
                this.$refs.infoDialog.showModal()
                window.addEventListener('click', checkClickOutside);
            } else if (this.$refs.infoDialog.open) {
                this.$refs.infoDialog.close();
                window.addEventListener('click', checkClickOutside);
            }
        }
    }
}
</script>

<style lang="postcss">
#modal {
    @apply hidden fixed left-0 max-h-screen w-screen overflow-y-auto
        sm:w-2/3 lg:w-1/2 2xl:w-1/3 p-8 text-gray-100;
    direction: rtl;
    pointer-events: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
#modal::-webkit-scrollbar {
  display: none;
}
#modal nav {
    direction: ltr;
}

#modal[data-info-panel] {
    @apply grid gap-y-4;
}

.info-panel {
    @apply hidden bg-gray-800 bg-opacity-75 p-8 border rounded border-gray-100;
    direction: ltr;
}
</style>
