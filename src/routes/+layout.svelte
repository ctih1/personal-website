<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { windows } from '$lib/stores';

	let { children } = $props();

	$effect(() => {
		console.log($windows);
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
