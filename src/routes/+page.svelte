<script lang="ts">
	import Icon from "$lib/components/desktop/taskbar/Icon.svelte";
	import Window from "$lib/components/desktop/Window.svelte";
	import Example from "$lib/components/windows/Example.svelte";
	import Game from "$lib/components/windows/Game.svelte";
	import { windows } from "$lib/stores";
</script>

<div class="bg"></div>
<div id="main-layout" class="w-11/12 max-w-4xl ml-auto mr-auto rounded-xl mt-8 p-2">
    <h1>Welcome to my website!</h1>
</div>

<Example/>
<Game/>

<div class="absolute bottom-0 w-full bg-white flex pl-2">
{#each $windows as rawWindow}
{@const id = rawWindow[0]}
{@const window = rawWindow[1]}
    <Icon closed={window.closed} hidden={window.hidden} icon={window.icon} windowTitle={window.title} id={id}/>
{/each}
</div>

<style>
    .bg {
        position: absolute;
        background-image: url("background.webp");
        background-size: 200%;
        background-position: center;
        top: 0px;
        left: 0px;
        min-height: 100vh;
        width: 100vw;
        z-index: -1;
        filter: blur(8px);
        transform: scale(1.1);
    }

    #main-layout {
        backdrop-filter: brightness(200%);
    }
</style>