<script lang="ts">
	import FormTocador from './../../components/forms/formTocador.svelte';
	import Body from './../../components/base/body.svelte';

	export let data : any 
	console.log(data)
</script>
<Body>
	<FormTocador data={data} />
</Body>
