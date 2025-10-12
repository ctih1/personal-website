<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { windows } from '$lib/stores';
	import consola from "consola";

	let { children } = $props();

	consola.level = 4;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
