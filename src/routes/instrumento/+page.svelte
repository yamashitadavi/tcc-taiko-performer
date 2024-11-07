<script lang="ts">
	import Body from './../components/base/body.svelte';
	import { Instrumento } from '../components/classes/classes';
	import FormInstrumento from './../components/forms/formInstrumento.svelte';
    export let formData : any = { response: new Instrumento({}) }
</script>
<Body>
    <FormInstrumento data={formData}>
    </FormInstrumento>
</Body>
