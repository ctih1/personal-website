<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { windows } from '$lib/stores';
	import consola from "consola";
	import DebugSpan from '$lib/components/DebugSpan.svelte';
	import { debug } from '$lib';

	let { children } = $props();

	consola.level = 4;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if debug}
<div class="absolute bg-white opacity-95 right-0 top-0">
	<ul>

    {#each $windows as rawWindow}
    {@const id = rawWindow[0]}
    {@const window = rawWindow[1]}
        <li class="flex flex-col">
			<span>#{id} - {window.title}</span>
			<span>focused: <DebugSpan status={window.focused} /> closed: <DebugSpan status={window.closed} /> hidden: <DebugSpan status={window.hidden} /></span>
		</li>
		<br>
    {/each}
	</ul>

</div>
{/if}

{@render children?.()}
