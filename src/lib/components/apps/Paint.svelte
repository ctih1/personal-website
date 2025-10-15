<script lang="ts">
	import { onMount } from "svelte";
    import Window from "../desktop/windows/Window.svelte";
	import consola from "consola";
	import { windows, type ManagedWindow } from "$lib/stores";

    let windowElement: Window;
    let windowId: number;
    let window: ManagedWindow | undefined = $state();

    let canvas: HTMLCanvasElement;
    let indicator: HTMLDivElement;
    let context: CanvasRenderingContext2D | undefined = undefined;

    const COLORS = ["rgb(0,0,0)", "rgb(255,255,255)", "rgb(255,0,0)", "rgb(0,255,0)", "rgb(0,0,255)"];
    let activeColor: string = $state("");
    let mouseDown = false;

    let brushSize: number = $state(5);
    
    onMount(() => {
        windowId = windowElement.id;
        window = $windows.get(windowId)!;
        context = canvas.getContext("2d")!;

        canvas.addEventListener("mousedown", e => {
            consola.debug("Paint mouse down");
            mouseDown = true;
        })
        canvas.addEventListener("mouseup", e => {
            consola.debug("Paint mouse up");
            mouseDown = false;
        })

        canvas.addEventListener("mouseleave", e => {
            mouseDown = false;
        })

        canvas.addEventListener("mousemove", e => {
            if(!context) return;
            indicator.style.left = e.pageX -(brushSize/2) + "px";
            indicator.style.top = e.pageY -(brushSize/2) + "px" ;
            indicator.style.width = brushSize + "px";
            if(!mouseDown) return;
            
            context.fillStyle = activeColor;    
            context.fillRect(e.offsetX-(brushSize/2), e.offsetY-(brushSize/2), brushSize, brushSize);
        })

        canvas.addEventListener("wheel", e => {
            console.log(e);
            if(e.deltaY > 0 && brushSize > 0) {
                brushSize -= 1;
            } else if(e.deltaY < 0 && brushSize < 500) {
                brushSize += 1;
            }
            indicator.style.left = e.pageX -(brushSize/2) + "px";
            indicator.style.top = e.pageY -(brushSize/2) + "px" ;
            indicator.style.width = brushSize + "px";
        })
    })

    function selectColor(rgb: string) {
        activeColor = rgb;
    }

    function save() {
        const data = canvas.toDataURL("image/png");
        // @ts-ignore
        const newTab = window.open('about:blank','image from canvas');
        newTab!.document.write("<img src='" + data + "' alt='from canvas'/>");
    }

    windows.subscribe(windows => {
        window = windows.get(windowId);
    })
</script>

{#if window && !window.closed && !window?.hidden}
    <div bind:this={indicator} class="z-[200] pointer-events-none indicator outline-2 outline-white bg-black aspect-square absolute opacity-50"></div>
{/if}

<Window 
    windowTitle="Paint"
    iconUrl={new URL("brush.png", location.toString())}
    bind:this={windowElement}
>

    <h1>Paint (but bad)</h1>
    <button onclick={_ => context?.reset()} class="bg-red-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-red-600 active:bg-red-800">Reset</button>
    <button onclick={_ => save()} class="bg-green-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-green-600 active:bg-green-800">Save</button>
    <div class="flex">
        <canvas class="mt-8" width="500px" height="500px" bind:this={canvas}></canvas>
        <div class="tools flex flex-col w-32 bg-gray-300 h-full">
            <h3 class="text-xl font-semibold">colors</h3>
            {#each COLORS as rgb}
                <button aria-label={rgb} onclick={_ => selectColor(rgb)} style={`background-color: ${rgb}`} class="w-8 aspect-square p-1 pl-2 pr-2">
                    {#if activeColor === rgb}x{/if}
                </button>
            {/each}
            <h3 class="text-xl font-semibold">brush size: <input class="outline-gray-500 p-1 w-16 transition-[outline] outline-1 hover:outline-2 rounded-xl" bind:value={brushSize} type="number" min=1 max=500>px</h3>
            <input bind:value={brushSize} type="range" min=1 max=500>
            <p>(or scrollwheel)</p>
        </div>
    </div>
</Window>
