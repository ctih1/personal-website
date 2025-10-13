<script lang="ts">
	import { on } from "svelte/events";
    import Window from "../desktop/windows/Window.svelte";
	import { onMount } from "svelte";
	import { windows } from "$lib/stores";

    let number = Math.round(Math.random() * 100);
    let inputValue: number = $state(0);
    let guesses: number = $state(0);
    let result: string = $state("");
    let windowElement: Window;

    const guess = () => {
        guesses++;
        if(inputValue > number) {
            result = "Too big";
        } else if(inputValue < number) {
            result = "Too small";
        } else {
            result = "Correct!";
        }
    }
</script>

<Window 
    bind:this={windowElement}
    windowTitle="Number guessing game" 
>
    <div id="contents" class="pb-2">
        <p class="absolute right-10 top-5">Guesses: {guesses}</p>
        <h1>Guess a number!</h1>
        <label for="number-picker">Guess (between 0 and 100): </label>
        <input bind:value={inputValue} class="outline-purple-500 p-1 pl-2 pr-2  transition-[outline] outline-1 hover:outline-2 rounded-xl" min=0 max=100 id="number-picer" type="number">

        <button onclick={_ => guess()} class="bg-purple-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-purple-600 active:bg-purple-800">Guess!</button>

        <h2>{result}</h2>
        {#if result === "Correct!"} 
            <button onclick={_ => {
                number = Math.round(Math.random() * 100);
                result = "";
                guesses = 0;
            }} class="bg-purple-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-purple-600 active:bg-purple-800">Play again!</button>
        {/if}
    </div>

</Window>
