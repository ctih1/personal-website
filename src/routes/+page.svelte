<script lang="ts">
	import Icon from "$lib/components/desktop/taskbar/Icon.svelte";
	import Window from "$lib/components/desktop/windows/Window.svelte";
	import Example from "$lib/components/apps/Example.svelte";
	import Game from "$lib/components/apps/Game.svelte";
	import { windows } from "$lib/stores";
	import Shortcut from "$lib/components/desktop/Shortcut.svelte";
	import DuolingoStreak from "$lib/components/apps/DuolingoStreak.svelte";
	import FlappyBird from "$lib/components/apps/FlappyBird.svelte";
</script>

<div class="bg"></div>
<div class="desktop grid-cols-9 grid-rows-12">
    {#each $windows as rawWindow}
    {@const id = rawWindow[0]}
    {@const window = rawWindow[1]}
        <Shortcut icon={window.icon} id={id} windowTitle={window.title} />
    {/each}
</div>

<Example/>
<Game/>
<DuolingoStreak />
<FlappyBird />


<div class="absolute bottom-0 w-full glass flex pl-2 space-x-4">
{#each $windows as rawWindow}
{@const id = rawWindow[0]}
{@const window = rawWindow[1]}
    <Icon pinned={window.title === "Example window"} focused={window.focused} closed={window.closed} hidden={window.hidden} icon={window.icon} windowTitle={window.title} id={id}/>
{/each}
</div>

<style>
    .bg {
        position: absolute;
        background-size: 200%;
        background-position: center;
        top: 0px;
        left: 0px;
        min-height: 100vh;
        width: 100vw;
        z-index: -1;
        transform: scale(1.1);
    }

    #main-layout {
        backdrop-filter: brightness(200%);
    }
</style>