<script lang="ts">
	import { onMount, type Snippet } from "svelte";
    import { windows, currentWindowId } from "$lib/stores";
    import type { ManagedWindow } from "$lib/stores";

    interface Props {
        windowTitle: string;
        resizable: boolean;
        iconUrl: URL;
        children: Snippet
    }

    let {windowTitle, resizable, iconUrl, children} = $props();

    let element: HTMLDivElement;
    let id: number = $currentWindowId;
    let isDragging = false;
    let offsetX: number, offsetY: number;

    let window: ManagedWindow = $state({
        closed: false,
        hidden: false,
        icon: iconUrl,
        title: windowTitle
    });

    onMount(() => {
        $windows.set(id, window);
        $windows = $windows;
        $currentWindowId++;
        
        element.addEventListener("mousedown", e => {
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
        $windows.set(id, window);
        $windows = $windows;
    }

    const hide = () => { window.hidden = true; updateStore() };
    const close = () => { window.closed = true; updateStore() };

    windows.subscribe(windows => {
        let thisWindow = windows.get(id);
        if(thisWindow) {
            console.log(`${id} Recieved update`);
            window = thisWindow;
        }
    })
</script>


<div bind:this={element} class="bg-white pl-2 pr-2 w-2xl absolute rounded-md">
    {#if !window.hidden && !window.closed}
    <div role="dialog" tabindex={id} class="top-bar w-full h-10 flex justify-between">
        <div class="info flex">
            <img class="mr-2" alt={windowTitle + "icon"} width="20px" height="20px" src={iconUrl}>
            <p class="text-2xl">{windowTitle}</p>
        </div>

        <div class="actions">
            <button onclick={_ => hide()}>-</button>
            <button>[]</button>
            <button onclick={_ => close()}>x</button>

        </div>
    </div>
    <div class="content">
        {@render children?.()}
    </div>
{/if}

</div>