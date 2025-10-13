<script lang="ts">
	import { windows } from "$lib/stores";
    import focus from "$lib/components/desktop/windows/Window.svelte";
	import consola from "consola";

    interface Props {
        windowTitle: string,
        icon?: URL,
        id: number,
    }

    let { windowTitle, icon, id}: Props = $props();

    function openWindow() {
        consola.debug(`Opening window #${id}`)

        let current = $windows.get(id)!;

        $windows.forEach(val => {
            val.focused = false;
        });
        current.focused = true;
        current.closed = false;
        current.hidden = false;

        $windows.set(id, current!);
        $windows = $windows;
    }
</script>

<div class="items-center w-20 h-fit aspect-square">
    <button onclick={_ => openWindow()} class="w-full justify-center flex flex-col aspect-square">
        {#if icon}
            <img src={icon.toString()} class="max-h-12 mr-auto ml-auto rounded-sm" alt={windowTitle}>
        {:else}
            <img src="globe.svg" class="h-12 w-12 mr-auto ml-auto rounded-sm" alt="Placeholder">
        {/if}
        <p class="text-sm w-fit mr-auto ml-auto">{windowTitle}</p>
    </button>
</div>
