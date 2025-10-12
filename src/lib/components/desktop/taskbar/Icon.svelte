<script lang="ts">
	import { windows } from "$lib/stores";
	import consola from "consola";

    interface Props {
        windowTitle: string,
        icon?: URL,
        closed: boolean,
        hidden: boolean,
        id: number
    }

    let { windowTitle, icon, closed, hidden, id }: Props = $props();

    function toggleWindow() {
        consola.debug(`Toggling window #${id}`)

        let current = $windows.get(id)!;

        if(current.closed) {
            consola.info(`Window #${id} is closed. Showing and opening`);

            current.closed = false;
            current.hidden = false;
        } else {
            current.hidden = !current.hidden;
        }

        $windows.set(id, current!);
        $windows = $windows;
    }
</script>

<div class="aspect-square h-14 w-72 items-center">
    <button onclick={_ => toggleWindow()} class="flex items-center w-full">
        {#if icon}
            <img src={icon.toString()} class="h-12" alt={windowTitle}>
        {:else}
            <img src="globe.svg" class="h-12" alt="Placeholder">
        {/if}
        <p class="text-nowrap ml-2">{windowTitle}</p>
    </button>
    {#if !closed}
        <div class="w-72 h-1 mt-1 bg-blue-600" class:opacity-25={hidden}></div>
    {/if}
</div>