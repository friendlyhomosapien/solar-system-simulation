<template>
    <span class="fixed w-full z-10">
        <div class="relative bg-gray-200 container mx-auto p-20 pointer-events-auto">
            <div class="float-right">
                <button @click="$emit('close')" type="button">
                    <XIcon
                        class="h-6 w-6 text-gray-900"
                    />
                </button>
            </div>
            <div class="space-y-2">
                <GlitchEffect class="text-4xl tracking-widest float-left mr-4 py-2 px-4 bg-black">
                    SOLAR
                </GlitchEffect>
                <p class="leading-relaxed">
                    Thankyou for visiting my solar simulation project!</p>
                    By clicking on a planet or the sun information about the object will be shown on screen.
                    It's also possible to navigate between planets by using the arrows shown in the information modal
                    The planets have been scaled relative to earth.
                    They are not scaled relative to the sun because it would make them too small to see.
                <p>You can stop the planets from orbitting by clicking on 'orbit toggle'.</p>
                <p>To enable camera control over the camera's position click 'camera control'</p>
            </div>
        </div>
    </span>
</template>
<script>
import GlitchEffect from '!/GlitchEffect/GlitchEffect.vue';

import {
    XIcon,
} from '@heroicons/vue/solid';

export default {
    components: {
        XIcon,
        GlitchEffect
    },

    emits: ['close']
}
</script>
