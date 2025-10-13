<script lang="ts">
	import { windows } from "$lib/stores";
    import focus from "$lib/components/desktop/windows/Window.svelte";
	import consola from "consola";

    interface Props {
        windowTitle: string,
        icon?: URL,
        closed: boolean,
        hidden: boolean,
        id: number,
        focused: boolean,
        pinned: boolean
    }

    let { windowTitle, icon, closed, hidden, id, focused, pinned }: Props = $props();

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

        $windows.forEach(val => {
            val.focused = false;
        });
        current.focused = true;

        $windows.set(id, current!);
        $windows = $windows;
    }
</script>

{#if pinned || !closed}
<div class="h-14 items-center">
    <button onclick={_ => toggleWindow()} class="flex items-center w-fit">
        {#if icon}
            <img src={icon.toString()} class="h-12 rounded-sm" alt={windowTitle}>
        {:else}
            <img src="globe.svg" class="h-12 rounded-sm" alt="Placeholder">
        {/if}
        {#if $windows.entries().filter(v => !v[1].hidden && !v[1].closed).toArray().length < 4}
         <p class="text-nowrap ml-2 w-fit">{windowTitle}</p>
        {/if}
    </button>
    {#if !closed}
        <div class="h-1 mt-1 bg-blue-600 opacity-50" class:opacity-100={focused}  class:opacity-25={hidden}></div>
    {/if}
</div>
{/if}