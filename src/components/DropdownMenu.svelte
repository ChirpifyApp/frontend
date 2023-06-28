<script lang="ts">
	let show = false;
	let dropdownRef: HTMLDivElement | undefined;

	function toggleDropdownMenu(event: MouseEvent) {
		event.stopPropagation();
		show = !show;
	}

	function hideDropdownMenu(event: MouseEvent) {
		if (!dropdownRef) return;
		if (event.target === dropdownRef || dropdownRef.contains(event.target as Node)) return;
		show = false;
	}
</script>

<svelte:body on:click={hideDropdownMenu} />

<slot name="button" {toggleDropdownMenu} />

{#if show}
	<div class="relative" bind:this={dropdownRef}>
		<slot name="dropdown" />
	</div>
{/if}
