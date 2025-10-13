<script lang="ts">
    let { status }: { status: boolean } = $props()
</script>

<span class:text-green-500={status} class:text-red-500={!status}>{status}</span>