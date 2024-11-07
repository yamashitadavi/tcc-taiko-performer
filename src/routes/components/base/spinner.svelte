<script>
    export let loading = false
    export let className = 'loading-lg text-primary'
    export let containerClass = '' 
</script>

<div class:visible-i={loading} class="z-50 bg-black bg-opacity-40 absolute top-0 bottom-0 left-0 right-0 w-full h-full items-center justify-center hidden {containerClass}" >
	<span class="loading loading-spinner {className}"></span>
</div>