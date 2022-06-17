<template>
    <div id="dn-logo-animation" class="relative">
        <div
            v-for="i in 12"
            :key="i"
            :id="`dn-logo-panel-${i}`"
            :class="i > 1 ? 'absolute' : 'relative'"
            class="dn-logo-panel top-0 w-[40rem] h-[24rem]"
        > 
        </div>
    </div>
</template>

<script>
import gsap from 'gsap';

export default {
    mounted() {
        staggerLogo();
    }
}

function staggerLogo() {
    const tl = gsap.timeline();
    tl.from('.dn-logo-panel', {
        delay: .5,
        scale: 0.4,
        // y: 80,
        ease: "back.out(1.5)",
        duration: 1,
        stagger: {
            from: "end",
            each: .25
        }
    });
    tl.from('.dn-logo-panel', {
        opacity: 0,
        delay: .5,
        ease: "back.out(1.5)",
        duration: 1,
        stagger: {
            from: "end",
            each: .25
        }
    }, '<');
    // tl.from('.dn-logo-panel',
    //     {
    //         opacity: .5,
    //         duration: .5,
    //         ease: "power3.in",
    //     }
    // )
    // tl.to('.dn-logo-panel',
    //     {
    //         opacity: .5,
    //         duration: .5,
    //         ease: "power3.in",
    //         repeat: -1,
    //         yoyo: true,
    //         stagger: {
    //             from: "start",
    //             each: .1,
    //         }
    //     }
    // )
}
</script>

<style>
/* .dn-logo-panel {
    clip-path: polygon(75% 56.25%, 50% 75%, 100% 75%);
} */
#dn-logo-animation {
    --color-primary: rgba(240, 240, 240, 1);
    --color-secondary: rgb(255, 50, 50);
}

#dn-logo-animation:hover #dn-logo-panel-1
/* #dn-logo-animation:hover #dn-logo-panel-2,
#dn-logo-animation:hover #dn-logo-panel-3 */
{
    transform: translate(40px);
}

#dn-logo-panel-1 {
    clip-path: polygon(75% 50%, 75% 100%, 100% 75%);
    background-color: var(--color-secondary);
}
#dn-logo-panel-2 {
    clip-path: polygon(75% 50%, 75% 100%, 50% 75%);
    background-color: var(--color-secondary);
}
#dn-logo-panel-3 {
    clip-path: polygon(100% 75%, 100% 25%, 75% 50%);
    background-color: var(--color-primary);
}
#dn-logo-panel-4 {
    clip-path: polygon(75% 0%, 75% 50%, 100% 25%);
    background-color: var(--color-primary);
}
#dn-logo-panel-5 {
    clip-path: polygon(75% 0%, 75% 50%, 50% 25%);
    background-color: var(--color-primary);
}
#dn-logo-panel-6 {
    clip-path: polygon(50% 75%, 50% 25%, 75% 50%);
    background-color: var(--color-primary);
}
#dn-logo-panel-7 {
    clip-path: polygon(50% 75%, 50% 25%, 25% 50%);
    background-color: var(--color-primary); 
}
#dn-logo-panel-8 {
    clip-path: polygon(25% 50%, 25% 100%, 50% 75%);
    background-color: var(--color-primary); 
}
#dn-logo-panel-9 {
    clip-path: polygon(25% 50%, 25% 100%, 0% 75%);
    background-color: var(--color-primary); 
}
#dn-logo-panel-10 {
    clip-path: polygon(0% 25%, 0% 75%, 25% 50%);
    background-color: var(--color-primary); 
}
#dn-logo-panel-11 {
    clip-path: polygon(25% 0%, 25% 50%, 50% 25%);
    background-color: var(--color-secondary); 
}
#dn-logo-panel-12 {
    clip-path: polygon(25% 0%, 25% 50%, 0% 25%);
    background-color: var(--color-secondary); 
}
</style>
