<script lang="ts">
	import { onMount, type Snippet } from "svelte";
    import { windows, currentWindowId } from "$lib/stores";
    import type { ManagedWindow } from "$lib/stores";
    import { twMerge } from "tailwind-merge";
	import consola from "consola";
	import { debug } from "$lib";

    interface Props {
        windowTitle: string;
        iconUrl?: URL;
        overrideWindowClass?: string;
        children: Snippet
    }

    let {windowTitle, iconUrl = undefined, overrideWindowClass = undefined, children}: Props = $props();
    let element: HTMLDivElement;
    let topBar: HTMLDivElement;
    let id: number = $state(-1);
    let isDragging = false;
    let offsetX: number, offsetY: number;

    let debugLightActive: boolean = $state(false);

    let window: ManagedWindow = $state({
        closed: true,
        hidden: false,
        icon: iconUrl,
        title: windowTitle,
        focused: false
    });

    onMount(() => {
        id = $currentWindowId++;
        consola.debug(`Window #${id} mounted`);

        $windows.set(id, window);
        $windows = $windows;

        element.style.top = 30 + id*45 + "px";
        element.style.left = 30 + id*45 + "px";
        
        topBar.addEventListener("mousedown", e => {
            if(window.hidden || window.closed) return;
            focus();
            isDragging = true;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
        })

        document.addEventListener("mousemove", e => {
            if(!isDragging) return;
            element.style.left = e.pageX - offsetX + "px";
            element.style.top = e.pageY - offsetY + "px";
        })

        document.addEventListener("mouseup", _ => {
            isDragging = false;
        })
    })


    function updateStore() {
        consola.debug(`Updating store for window #${id}`);
        $windows.set(id, window);
        $windows = $windows;
    }

    const hide = () => { 
        consola.info(`Hiding window #${id}`);
        window.hidden = true;
        updateStore()
    };

    const close = () => { 
        consola.info(`Closing window #${id}`);
        window.closed = true;
        updateStore() 
    };

    windows.subscribe(windows => {
        let thisWindow = windows.get(id);
        if(thisWindow && thisWindow != window) {
            consola.trace(`Window #${id} Recieved update`);
            window = thisWindow;
        }
        if(!debug) return;
        requestAnimationFrame(() => {
            debugLightActive = true;
            setTimeout(() => {
                debugLightActive = false;
            }, 100)
        })
    });

    export function focus() {
        if($windows.get(id)?.focused) {
            return;
        }
        $windows.forEach(val => {
            val.focused = false;
        });
        $windows = $windows;
        window.focused = true;
        updateStore();
    }

    export { id };
</script>


<div onclick={_ => focus()} class:z-50={window.focused} class:pointer-events-none={window.hidden || window.closed} bind:this={element} class:opacity-0={window.hidden || window.closed} class={twMerge("z-10 rounded-3xl bg-white pl-2 pr-2 pb-2 min-w-80 shadow-5xl absolute h-fit", overrideWindowClass)}>
    <div bind:this={topBar} role="dialog" tabindex={id} class="top-bar w-full h-10 pt-1 flex justify-between items-center">
        <div class="info flex">
            {#if iconUrl}
            <img class="mr-2 aspect-square w-6 rounded-sm" alt={windowTitle + "icon"} src={iconUrl.toString()}>
            {/if}
            <p class="text-xl font-semibold">{windowTitle}</p>
        </div>

        <div class="actions items-center">
            <button class="text-2x" onclick={_ => hide()}>-</button>
            <button class="text-2xl" onclick={_ => close()}>x</button>
        </div>
        {#if debug}
            <div class="absolute right-20 items-center flex space-x-2 w-20">
                <p class="w-fit">#{id}</p>
                <div class:opacity-100={debugLightActive} class="w-4 h-4 rounded-4xl bg-green-600 opacity-0"></div>
            </div>

        {/if}
    </div>
    <div class="content">
        {@render children?.()}
    </div>
</div>

