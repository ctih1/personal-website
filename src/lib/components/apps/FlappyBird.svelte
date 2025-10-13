<script lang="ts">
	import { onMount, settled } from "svelte";
    import Window from "../desktop/windows/Window.svelte";
	import { windows } from "$lib/stores";
	import consola from "consola";
	import { render } from "svelte/server";
	import DebugSpan from "../DebugSpan.svelte";
	import { fromTheme } from "tailwind-merge";
	import { debug } from "$lib";

    interface Pipe {
        x: number,
        y: number,
        scored: boolean,
    }

    let pipes: [Pipe, Pipe][] = $state([]);

    let gameArea: HTMLDivElement;
    let bird: HTMLDivElement;
    let birdX = $state(128);
    let birdWidth = 32;
    let pipeWidth = 160;
    let birdY = $state(100);
    let velocity = 0;
    let minGap = 150;
    let boardHeight = 600;
    let scrollSpeed = 3;

    let windowElement: Window;
    let paused = $state(true);

    let lastFrame = 0;
    let renderedFps = $state(0);

    let pipeHeight = 384;
    let birdHit: boolean = $state(false);

    let score: number = $state(0);
    let highscore: number = $state(Number(localStorage.getItem("flappybird-score"))??0);

    document.addEventListener("keydown", e => {
        if(e.keyCode === 38 && !birdHit) {
            paused = false;
            velocity = 12;
        } if(e.keyCode === 32 && debug) {
            paused = !paused;
        }
    });
    

    async function pipeLoop() {
        pipes.forEach(pair => {
            pair[0].x -= scrollSpeed;
            pair[1].x -= scrollSpeed;

            if(birdX + birdWidth > pair[0].x && birdX < pair[0].x+pipeWidth) {
                if(birdY < pair[0].y+pipeHeight || birdY+birdWidth > pair[1].y) {
                    console.log("Pipe hit!");
                    birdHit = true;
                }
                if(!pair[0].scored) {
                    pair[0].scored = true;
                    score++;
                    if(score > highscore) {
                        highscore = score;
                    }
                }
            }
        })
        
        pipes = pipes.filter(pipe => {
            return pipe[0].x > -200
        });

        if(pipes.length < 2) {
            let lastPipePair = pipes.at(pipes.length-1);
            let newX = (lastPipePair?.[0].x ?? 0) + 500 + Math.random()*150;
            let topPipeY = Math.random() * (boardHeight/1.5) - pipeHeight;
            let bottomPipeY = topPipeY + pipeHeight + minGap + Math.random()*100;
            pipes.push([{x: newX, y: topPipeY, scored: false}, {x: newX, y: bottomPipeY, scored: false}]);
        }
    }

    async function gameLoop() {
        const now = performance.now();
        const delta = now - lastFrame;
        lastFrame = now;
        renderedFps = 1000 / delta;

        const deltaSeconds = delta / 1000;


        if(!paused) {

            if(!birdHit){
                velocity -= 35 * deltaSeconds;
                bird.style.transform=`rotate(${velocity*-2}deg)`
                birdY -= velocity*deltaSeconds*60;
                pipeLoop();
            }

        }

        bird.style.top = birdY + "px";

        if(birdY > 600-birdWidth) {
            birdHit = true;
            birdY = 600-birdWidth;
            velocity = 0;
        }

        
        requestAnimationFrame(() => {
            gameLoop();
        });

    }

    onMount(async () => {
        gameLoop();

        gameArea.addEventListener("touchstart", e => {
            if(!birdHit) {
                paused = false;
                velocity = 12;
            }
        })
    });

    function resetGame() {
        birdHit = false;
        paused = true;
        birdX = 128;
        birdY = 100;
        pipes = [];
        
        if(score > Number(localStorage.getItem("flappybird-score")??0)) {
            localStorage.setItem("flappybird-score", score.toString());
        }

        score=0;
    }
    
</script>

<Window 
    windowTitle="Flappy bird"
    bind:this={windowElement}
    iconUrl={new URL("bird.svg", window.location.toString())}
    overrideWindowClass="w-[600px] h-[600px]"
>

<div bind:this={gameArea} class="game relative overflow-hidden w-full h-[560px] max-w-full max-h-full">
    <p class="z-50 absolute">{Math.round(renderedFps*10)/10}fps</p>
    <div class="bird absolute w-8 h-8 left-32 z-[3] bg-red-600" bind:this={bird}>
        {#if debug}
        <p>{Math.round(birdX)},{Math.round(birdY)}</p>
        {/if}
    </div>
    
    {#each pipes as pipe}
        {#each pipe as part}
            <div style={`top: ${part.y}px; left: ${part.x}px`} class={`absolute bg-green-600 w-40 h-96`}>
                {#if debug}
                <p>{Math.round(part.x)},{Math.round(part.y)}</p>
                {/if}
            </div>
        {/each}
    {/each}

    {#if paused && !birdHit}
        <h2 class="absolute top-15">Arrow up to start</h2>
    {/if}

    <h3 class="absolute right-0 text-xl font-semibold">Score: {score}/{highscore}</h3>
    {#if birdHit}
        <button onclick={_ => resetGame()} class="absolute top-[30%] left-[30%] bg-green-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-green-600 active:bg-green-800 text-2xl">Save score and restart</button>
    {/if}
</div>
</Window>
