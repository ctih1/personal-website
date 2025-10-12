<script lang="ts">
	import { onMount, type Snippet } from "svelte";
    import { windows, currentWindowId } from "$lib/stores";
    import type { ManagedWindow } from "$lib/stores";
    import { twMerge } from "tailwind-merge";
	import consola from "consola";

    interface Props {
        windowTitle: string;
        iconUrl?: URL;
        overrideWindowClass?: string;
        children: Snippet
    }

    let {windowTitle, iconUrl = undefined, overrideWindowClass = undefined, children}: Props = $props();

    let element: HTMLDivElement;
    let topBar: HTMLDivElement;
    let id: number = -1;
    let isDragging = false;
    let offsetX: number, offsetY: number;

    let window: ManagedWindow = $state({
        closed: false,
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
            consola.debug(`Window #${id} detected possible drag start`);
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
        consola.info(`Updating store for window #${id}`);
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
        if(thisWindow) {
            consola.info(`Window #${id} Recieved update`);
            window = thisWindow;
        }
    });

    function focus() {
        consola.info(`Granting window #${id} focus`);
        $windows.forEach(val => {
            if(val.focused) {
                consola.info(`Revoking window #${id} focus`);
            }
            val.focused = false;
        });
        $windows = $windows;
        window.focused = true;
        updateStore();
    }

    export { id };
</script>


<div onclick={_ => focus()} class:z-50={window.focused} bind:this={element} class:opacity-0={window.hidden || window.closed} class={twMerge("bg-white pl-2 pr-2 w-2xl absolute rounded-2xl drop-shadow-2xl", overrideWindowClass)}>
    <div bind:this={topBar} role="dialog" tabindex={id} class="top-bar w-full h-10 flex justify-between">
        <div class="info flex">
            {#if iconUrl}
            <img class="mr-2" alt={windowTitle + "icon"} width="20px" height="20px" src={iconUrl.toString()}>
            {/if}
            <p class="text-2xl mix-blend-difference invert grayscale">{windowTitle}</p>
        </div>

        <div class="actions items-center">
            <button class="mix-blend-difference invert grayscale text-2xl" onclick={_ => hide()}>-</button>
            <button class="mix-blend-difference invert grayscale text-2xl" onclick={_ => close()}>x</button>
        </div>
    </div>
    <div class="content">
        {@render children?.()}
    </div>
</div>