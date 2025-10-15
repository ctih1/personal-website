<script lang="ts">
    import Window from "../desktop/windows/Window.svelte";

    let content: string = $state("");

    let chars = $derived(content.length);
    let words = $derived(content.split(" ").length - 1);

    function save() {
        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
        element.setAttribute("download", "notes.txt");

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
    }
</script>

<Window 
    iconUrl={new URL("notepad.png", window.location.toString())}
    windowTitle="Notepad"
>

    <h1>Notepad</h1>
    <button onclick={_ => save()} class="bg-gray-500 rounded-xl p-1 pl-2 pr-2 transition-colors hover:bg-gray-600 active:bg-gray-800">Save</button>
    <textarea class="w-full h-96 resize-none outline-0" autofocus bind:value={content}></textarea>
    <p>{chars} chars, {words} words</p>
</Window>
