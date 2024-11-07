<script lang="ts" >
	import FormTocador from './../components/forms/formTocador.svelte';
	import Card from './../components/base/card.svelte';
	import Table from './../components/base/table.svelte';
	import Body from "../components/base/body.svelte";
	import Trash from '../components/icons/trash.svelte';
	import { Tocador } from '../components/classes/classes';
	import { deleteRowTable } from '../functions/request';
	import Spinner from '../components/base/spinner.svelte';
	import { invalidateAll } from '$app/navigation';

	let cols = [
		{ label: 'Nome', value: 'recordUrl', urlLabel: 'nome', type: 'link' }, 
		{ label: 'Data Entrada', value: 'dataEntrada', type: 'date' }, 
		{ label: '', value: 'delete', type: 'button', svg: { cmp: Trash, class: 'fill-primary'} }, 
	]
	
	let loading = false
	let modalCreate = false;
	export let formData : any = { response: new Tocador({}) }
	export let data : any
	
	async function rowAction({ detail } : any) {
		//delete
		console.log(detail)
		let { action, index } = detail
		if (action == 'delete') {
			loading = true
			await deleteRowTable('/tocadores', fetch, data.response.splice(index, 1)[0].id)
			invalidateAll()
			loading = false
		}
	}
</script>

<Body>
	<Card title="Tocadores" className="h-full overflow-auto" >
		<div slot="actions" >
			<button class="btn btn-primary" on:click={()=>modalCreate = true}>Criar</button>
		</div>
		<Table className="max-h-full h-full overflow-auto" key="id" columns={cols} bind:rows={data.response} on:rowaction={rowAction}></Table>
	</Card>
</Body>


<dialog id="my_modal_1" class="modal" class:modal-open={modalCreate} open={modalCreate}>
	<div class="modal-box overflow-auto flex flex-col min-w-[50%] min-h-[50%]">
		
		<FormTocador data={formData} on:success={()=>modalCreate = false}/>

	  	<div class="modal-action justify-start mt-auto pt-1">
			<form class="md:w-auto w-full" method="dialog ">
		  		<button class="btn w-full" on:click={()=>modalCreate=false}>Fechar</button>
			</form>
	 	</div>
	</div>
</dialog>

<Spinner {loading}/>