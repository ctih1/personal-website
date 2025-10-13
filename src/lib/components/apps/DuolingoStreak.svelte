<script lang="ts">
	import { windows } from "$lib/stores";
    import Window from "../desktop/windows/Window.svelte";
    
    let windowElement: Window;
    
    let username: string = $state("nevalaonni");

    windows.subscribe(windows => {
        const thisWindow = windows.get(windowElement?.id);
        if(thisWindow && thisWindow.focused && !thisWindow.closed) {
            getDuolingoStreak();
        }
    });

    interface Course {
        authorId: "duolingo",
        crowns: 999,
        fromLanguage: string,
        id: string,
        learningLanguage: string,
        placementTestAvailable: boolean,
        preload: boolean,
        title: string,
        xp: number
    };

    let streakLength: number | undefined = $state(undefined);
    let streakStartDate: Date = $state(new Date());
    let freezesUsed: number = $state(0);
    let courses: Course[] = $state([]);
    let currentlyLearningId: string = $state("");

    let error: string = $state("");

    function calculateDaysBetween(timeA: Date, timeB: Date): number {
        let distance = timeA.getTime() - timeB.getTime();
        return Math.max(Math.floor(distance / (1000 * 60 * 60 * 24)),0);
    }

    async function getDuolingoStreak() {
        error = "";
        await fetch(`/api/duolingo?username=${username}`)
            .then(response => response.json()).then(data => {
                const userData = data.users[0];
                if(!userData) {
                    error = "User not found";
                    return;
                }
                console.log(userData);
                if(userData["streakData"] && userData["streakData"]["currentStreak"]) {
                    streakStartDate = new Date(userData["streakData"]["currentStreak"]["startDate"]??0)
                    streakLength = Number(userData["streakData"]["currentStreak"]["length"]??0);
                    freezesUsed = calculateDaysBetween(new Date(), streakStartDate) - streakLength;
                } else {
                    streakStartDate = new Date(-1);
                    streakLength = 0;
                    freezesUsed = 0;
                }

                courses = userData["courses"];
                currentlyLearningId = userData["currentCourseId"];
        });
    }
</script>

<Window 
    windowTitle="Duolingo streak"
    iconUrl={"duolingo.svg"}
    overrideWindowClass="w-[500px]"
    bind:this={windowElement}
>
    <label for="duo-username">Override username</label>
    <input bind:value={username} class="outline-green-600 p-1 pl-2 pr-2  transition-[outline] outline-1 hover:outline-2 rounded-xl" id="duo-username" type="text">
    <button onclick={_ => getDuolingoStreak()} class="bg-green-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-green-600 active:bg-green-800">Search!</button>

    <h1 class="leading-11">{username === "nevalaonni" ? "my" : username+"'s"} duolingo streak</h1>
    {#if error}
        <h2 class="text-red-500">{error}</h2>
    {:else if streakLength !== undefined}
        <h2>{streakLength} days 🔥</h2>
        <h3>{freezesUsed} freezes used ❄️</h3>
        <h3>Started on {streakStartDate.toLocaleDateString()}</h3>

        <h2>Languages</h2>
        {#each courses as course}
            <h3 class="text-xl font-semibold">{course.title}</h3>
            <p>{course.xp} xp</p>
        {/each}

        <h2>Currently learning: {courses.find(val => val.id === currentlyLearningId)?.title}</h2>
    {:else}
        <h1>Loading...</h1>
    {/if}
</Window>
