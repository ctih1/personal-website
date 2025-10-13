<script lang="ts">
	import { onMount } from "svelte";
    import Window from "../desktop/windows/Window.svelte";
    import { Faker, pl } from "@faker-js/faker";
    import words from "$lib/assets/plwords.json";

    let word: string = $state("");
    let isFake: boolean = $state(false);
    let resultText = $state("");
    let usersGuess: string = $state("");

    let windowElement: Window;

    const STARTING_CLUSTER = ["sz", "cz", "prz", "trz", "grz", "wst", "zdr", "drz", "brz", "św", "źr"]
    const CENTRAL_CLUSTER = ["el", "dras", "miel", "i", "ier", "ić", "on", "ost", "arn", "plon", "szmor"]
    const ENDING_CLUSTER = ["ka", "ek", "", "asz", "owa", "ny", "a", "ta", "ik", "enie"]

    function createFakeWord(): string {
        const STARTING_INDEX = Math.round(Math.random() * (STARTING_CLUSTER.length-1));
        const CENTRAL_INDEX = Math.round(Math.random() * (CENTRAL_CLUSTER.length-1));
        const ENDING_INDEX = Math.round(Math.random() * (ENDING_CLUSTER.length-1));
        return `${STARTING_CLUSTER.at(STARTING_INDEX)}${CENTRAL_CLUSTER.at(CENTRAL_INDEX)}${ENDING_CLUSTER.at(ENDING_INDEX)}`;
    }

    const faker = new Faker({locale: [pl]});

    function createWord() {
        resultText = "";
        usersGuess = "";

        if(Math.random() > 0.5) {
            word = createFakeWord();
            isFake = true;
        } else {
            word = words.at(Math.round(Math.random()*(words.length-1)))!.toLowerCase();
            isFake = false;
        }
    }

    function guess(guess: "real" | "fake") {
        usersGuess = guess;
        if(usersGuess === "fake" && isFake) {
            resultText = "You were correct!";
        } else if(usersGuess === "real" && !isFake) {
            resultText = "You were correct!";
        } else {
            resultText = "You were incorrect!";
        }
    }
    onMount(() => {
        createWord();
    }) 
</script>

<Window 
    bind:this={windowElement}
    windowTitle="Number guessing game" 
    iconUrl={new URL("pl_flag.svg", window.location.toString())}
>
<h2>Polish word guesser</h2>
<p>Your job is to guess whether a word is a real or fake Polish word</p>

<div class="card">
    <h2>{word}</h2>
    {#if resultText}
        <h2 class="text-green-700" class:text-red-500={resultText.endsWith("incorrect!")}>{resultText}</h2>
        {#if usersGuess === "fake" && isFake || usersGuess === "real" && !isFake}
            <p>Good job! You identified the word correctly</p>
        {:else}
            <p>You guessed <span class="text-green-500" class:text-red-500={usersGuess==="fake"}>{usersGuess}</span>, but the word was <span class="text-green-500" class:text-red-500={isFake}>{isFake ? "fake" : "real"}!</span></p>

        {/if}
        <button onclick={_ => createWord()} class="bg-blue-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-blue-600 active:bg-blue-800 mt-4">Continue</button>
    {:else}
    <div class="buttons">
        <button onclick={_ => guess("real")} class="bg-green-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-green-600 active:bg-green-800">Real</button>
        <button onclick={_ => guess("fake")} class="bg-red-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-red-600 active:bg-red-800">Fake</button>
    </div>
    {/if}
</div>

</Window>
