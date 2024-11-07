<script lang="ts" >
	import FormTocador from './../components/forms/formTocador.svelte';
	import Card from './../components/base/card.svelte';
	import Table from './../components/base/table.svelte';
	import Body from "../components/base/body.svelte";
	import Trash from '../components/icons/trash.svelte';
	import { Apresentacao, Tocador } from '../components/classes/classes';
	import { deleteRowTable } from '../functions/request';
	import Spinner from '../components/base/spinner.svelte';
	import { invalidateAll } from '$app/navigation';
	import FormApresentacao from '../components/forms/formApresentacao.svelte';

	let cols = [
		{ label: 'Nome', value: 'recordUrl', urlLabel: 'nome', type: 'link' }, 
		{ label: 'Data/Hora', value: 'dataHora', type: 'datetime' }, 
		{ label: 'Apresentado', value: 'apresentado', type: 'checkbox' }, 

		{ label: '', value: 'delete', type: 'button', svg: { cmp: Trash, class: 'fill-primary'} }, 
	]
	
	let loading = false
	let modalCreate = false;
	export let formData : any = { response: new Apresentacao({}) }
	export let data : any
	
	async function rowAction({ detail } : any) {
		//delete
		console.log(detail)
		let { action, index } = detail
		if (action == 'delete') {
			loading = true
			await deleteRowTable('/apresentacoes', fetch, data.response.splice(index, 1)[0].id)
			invalidateAll()
			loading = false
		}
	}
</script>

<Body>
	<Card title="Apresentações" className="h-full overflow-auto">
		<div slot="actions" >
			<button class="btn btn-primary" on:click={()=>modalCreate = true}>Criar</button>
		</div>
		<Table className="max-h-full h-full overflow-auto" key="id" columns={cols} bind:rows={data.response} on:rowaction={rowAction}></Table>
	</Card>
</Body>


<dialog id="my_modal_1" class="modal" class:modal-open={modalCreate} open={modalCreate}>
	<div class="modal-box overflow-auto flex flex-col min-w-[50%] min-h-[50%]">
		
		<FormApresentacao data={formData} on:success={()=>modalCreate = false}/>

	  	<div class="modal-action justify-start mt-auto pt-1">
			<form class="md:w-auto w-full" method="dialog ">
		  		<button class="btn w-full" on:click={()=>modalCreate=false}>Fechar</button>
			</form>
	 	</div>
	</div>
</dialog>

<Spinner {loading}/>