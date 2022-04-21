<template>
    <span
      class="glitch-effect"
      :class="{
        'glitch-effect-hover': !auto,
        'glitch-effect-auto': auto
      }"
    >
        <span><slot /></span>
        <span><slot /></span>
    </span>
</template>

<script>
export default {
  props: {
    auto: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="postcss">
.glitch-effect {
    @apply relative flex justify-center items-center;
    --glitch-shadow:
        .25rem .25rem 0 rgba(255, 0, 0, .75),
        -.125rem .375rem 0 rgba(0, 255, 0, .75),
        .5rem .5rem 0 rgba(0, 0, 255, .75)
    ;
    --glitch-shadow-min:
        .25rem -.25rem 1px rgba(255, 0, 0, .75),
        -.5rem -.5rem 1px rgba(0, 0, 255, .75),
        -.375rem -.375rem 1px rgba(0, 255, 0, .75)
    ;
}

.glitch-effect span:first-child {
  @apply relative;
  clip-path: inset(0 0 50%);
}

.glitch-effect span:last-child {
  @apply absolute;
  clip-path: inset(50% 0 0 0);
}

.glitch-effect-hover:hover span:first-child {
  animation-name: TopGlitch;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.glitch-effect-hover:hover span:last-child {
  animation-name: BottomGlitch;
  animation-duration: 3s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.glitch-effect-auto span:first-child {
  animation-name: TopGlitch;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.glitch-effect-auto span:last-child {
  animation-name: BottomGlitch;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes TopGlitch {
  0% {
    color: rgba(255, 255, 255, 0);

    text-shadow: var(--glitch-shadow-min);
    text-decoration-line: line-through;

    transform: translateX(.25rem) skewX(12deg);
  }
  1% {
    color: rgba(255, 255, 255, 0);

    text-shadow: var(--glitch-shadow-min);
    text-decoration-line: line-through;

    transform: translateX(-.5rem) skewX(12deg);
  }
  2% {
    color: rgba(255, 255, 255, 0);

    text-shadow: var(--glitch-shadow-min);
    text-decoration-line: line-through;

    transform: translateX(-.5rem) skewX(12deg);
  }
  3% {
    color: rgba(255, 255, 255, 1);

    text-shadow: unset;
    text-decoration-line: none;

    transform: translateX(0) skewX(0);
  }
  7% {
    color: rgba(255, 255, 255, 1);

    text-shadow: unset;
    text-decoration-line: none;

    transform: translateX(0) skewX(0);
  }
  8% {
    color: rgba(255, 255, 255, 0);

    text-shadow: var(--glitch-shadow-min);
    text-decoration-line: line-through;

    transform: translateX(-.75rem) skewX(12deg);
  }
  9% {
    transform: translateX(1.5rem) skewX(12deg);
  }
  10% {
    color: rgba(255, 255, 255, 0);

    text-shadow: var(--glitch-shadow-min);
    text-decoration-line: line-through;

    transform: translateX(-.75rem) skewX(12deg);
  }
  11% {
    color: rgba(255, 255, 255, 1);

    text-shadow: unset;
    text-decoration-line: none;

    transform: translateX(0) skewX(0);
  }
  100% {
    color: rgba(255, 255, 255, 1);

    text-shadow: unset;
    text-decoration-line: none;

    transform: translateX(0) skewX(0);
  }
}

@keyframes BottomGlitch {
  0% {
    color: rgba(255, 255, 255, 0);

    text-shadow: var(--glitch-shadow);
    text-decoration-line: line-through;

    transform: translateX(-.5rem) skewX(12deg);
  }
  1% {
    color: rgba(255, 255, 255, 0);

    text-shadow: var(--glitch-shadow);
    text-decoration-line: line-through;
  
    transform: translateX(.5rem) skewX(12deg);
  }
  2% {
    color: rgba(255, 255, 255, 1);

    text-shadow: unset;
    text-decoration-line: none;

    transform: translateX(0) skewX(0);
  }
  3% {
    color: rgba(255, 255, 255, 1);

    text-shadow: var(--glitch-shadow);
    text-decoration-line: line-through;

    transform: translateX(0) skewX(0);
  }
  8% {
    color:rgba(255, 255, 255, 0);

    text-shadow: var(--glitch-shadow);
    text-decoration-line: line-through;

    transform: translateX(.75rem) skewX(12deg);
  }
  9% {
    transform: translateX(-1.5rem) skewX(12deg);
  }
  10% {
    color:rgba(255, 255, 255, 0);

    text-shadow: var(--glitch-shadow);

    transform: translateX(.75rem) skewX(12deg);
  }
  11% {
    color:rgba(255, 255, 255, 1);

    text-shadow: unset;
    text-decoration-line: none;

    transform: translateX(0) skewX(0);
  }
  100% {
    color: rgba(255, 255, 255, 1);

    text-shadow: unset;
    text-decoration-line: none;

    transform: translateX(0) skewX(0);
  }
}
</style>