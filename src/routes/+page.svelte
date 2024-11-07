
  
<script lang="ts">

  	import "../app.css"
	import Body from "./components/base/body.svelte";

	export let data : any
	console.log(data)
</script>

<Body>
	<div class="w-full h-full flex items-center justify-center flex-col">

		<!-- svelte-ignore a11y-media-has-caption -->
		{#if data.uwu}
		<iframe title="qwrqw" class="w-full h-full" src="https://www.youtube.com/embed/W9lCw3fpdRw?autoplay=1&controls=0&showinfo=0&rel=0" allow="autoplay" frameborder="0"></iframe>
		{:else if data.shikanokonokonokokoshitantan}
		<iframe title="qwrqw" class="w-full h-full" src="https://www.youtube.com/embed/RfA3hxAs5iM?autoplay=1&controls=0&showinfo=0&rel=0" allow="autoplay" frameborder="0"></iframe>
		{:else}
		<h1 class="text-8xl font-bold text-primary">Taiko Performer</h1>
		<h2 class="text-6xl text-secondary">Monte sua apresentação</h2>
		{/if}
	</div>
</Body>