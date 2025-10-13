<script lang="ts">
	import consola from "consola";
    import Window from "../desktop/windows/Window.svelte";

    let score: number = $state(0);
    let activeButton: number = $state(0);
    let secondsLeft: number = $state(15);
    let started: boolean = false;
    let ended: boolean = false;
    let accuracy: number[] = $state([]);

    function buttonCallback(index: number) {
        if(ended) return; 
        started = true;

        if(index === activeButton) {
            score++;
            secondsLeft += 0.30;
        } else {
            secondsLeft -= 0.2;
            activeButton = Math.round(Math.random()*3);
        }

        accuracy.push(index === activeButton ? 1 : 0);

        while(activeButton === index) {
            activeButton = Math.round(Math.random()*3);
        }

        consola.log(`New number #${activeButton}`)
    }

    function start() {
        ended = false;
        started = false;
        secondsLeft = 15;
        score = 0;
        activeButton = Math.round(Math.random()*3);
    }

    setInterval(() => {
        if(started) {
            secondsLeft -= 0.1
        }
        if(secondsLeft <= 0) {
            secondsLeft = 0;
            started = false;
            ended = true;
            activeButton = -1;
        }
    }, 100);
</script>

<Window 
    windowTitle="Happy Button"
    iconUrl={new URL("happybutton.png", window.location.toString())}
>
    <h1>happy button</h1>
    <p>Based off of the first game I ever made</p>

    <h3 class="text-xl font-semibold">time left: {Math.round(secondsLeft*1000)/1000}s</h3>
    <h3 class="text-xl font-semibold">score: {score}</h3>
    {#if accuracy.length > 0}
     <h3 class="text-xl font-semibold">accuracy: {Math.round(accuracy.reduce((a, b) => a + b) / accuracy.length * 10000)/100}%</h3>
    {/if}
    <div class="game flex flex-col">
        <div class="button-container flex space-x-2">
            {#each [0,1,2,3] as i}
                <button onclick={_ => buttonCallback(i)} class:bg-gray-700={activeButton === i} class="rounded-[100%] aspect-square w-32 bg-blue-500">{i}</button>
            {/each}
        </div>
        <button onclick={_ => start()} class="bg-blue-500 rounded-xl p-2 mt-8 ml-auto mr-auto transition-colors hover:bg-blue-600 active:bg-blue-800">Restart</button>
    </div>


</Window>
