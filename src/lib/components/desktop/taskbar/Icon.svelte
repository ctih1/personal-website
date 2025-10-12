<script lang="ts">
	import { windows } from "$lib/stores";

    interface Props {
        windowTitle: string,
        icon: URL,
        closed: boolean,
        hidden: boolean,
        id: number
    }

    let { windowTitle, icon, closed, hidden, id } = $props();

    function openWindow() {
        console.log(`Opening ${id}`)
        let current = $windows.get(id)!;
        current.closed = false;
        current.hidden = false;
        $windows.set(id, current!);
        $windows = $windows;
    }
</script>

<div class="aspect-square h-14 w-72 items-center">
    <div onclick={_ => openWindow()} class="flex items-center w-full">
        <img src={icon} class="h-12" alt={windowTitle}>
        <p class="text-nowrap ml-2">{windowTitle}</p>
    </div>
    {#if !closed}
        <div class="w-72 h-1 mt-1 bg-gray-800"></div>
    {/if}
</div>