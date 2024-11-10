
  
<script lang="ts">

  	import "../app.css"
	import Body from "./components/base/body.svelte";

	export let data : any
	console.log(data)
</script>

<Body>
	<div class="w-full h-full flex items-center justify-center flex-col">

		<h1 class="text-8xl font-bold text-primary">Taiko Performer</h1>
		<h2 class="text-6xl text-secondary">Monte sua apresentação</h2>

	</div>
</Body>