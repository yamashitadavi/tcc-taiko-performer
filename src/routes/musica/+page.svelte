<script lang="ts" >
	import Card from './../components/base/card.svelte';
	import Table from './../components/base/table.svelte';
	import Body from "../components/base/body.svelte";
	import Trash from '../components/icons/trash.svelte';
	import { Musica } from '../components/classes/classes';
	import { deleteRowTable } from '../functions/request';
	import { invalidateAll } from '$app/navigation';
	import FormMusica from '../components/forms/formMusica.svelte';

	let cols = [
		{ label: 'Nome', value: 'recordUrl', urlLabel: 'nome', type: 'link' }, 
		{ label: 'Tempo (min)', value: 'tempo' }, 
		{ label: '', value: 'delete', type: 'button', svg: { cmp: Trash, class: 'fill-primary'} }, 
	]
	
	let loading = false
	let modalCreate = false;
	export let formData : any = { response: new Musica({}) }
	export let data : any
	
	async function rowAction({ detail } : any) {
		//delete
		console.log(detail)
		let { action, index } = detail
		if (action == 'delete') {
			loading = true
			await deleteRowTable('/musicas', fetch, data.response.splice(index, 1)[0].id)
			invalidateAll()
			loading = false
		}
	}
</script>

<Body>
	<Card title="Músicas" className="h-full overflow-auto" >
		<div slot="actions" >
			<button class="btn btn-primary" on:click={()=>modalCreate = true}>Criar</button>
		</div>
		<Table className="max-h-full h-full overflow-auto" key="id" columns={cols} bind:rows={data.response} on:rowaction={rowAction}></Table>
	</Card>
</Body>


<dialog id="my_modal_1" class="modal" class:modal-open={modalCreate} open={modalCreate}>
	<div class="modal-box overflow-auto flex flex-col min-w-[50%] min-h-[50%]">

		<FormMusica data={formData} on:success={(e)=>{
			modalCreate = false
			//window.location = (window.location+'/'+e.detail.record.id)
		}}/>

	  	<div class="modal-action justify-start mt-auto pt-1">
			<form class="md:w-auto w-full" method="dialog ">
		  		<button class="btn w-full" on:click={()=>modalCreate=false}>Fechar</button>
			</form>
	 	</div>
	</div>
</dialog>