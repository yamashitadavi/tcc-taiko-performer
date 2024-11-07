<script lang="ts">

	import Spinner from '../base/spinner.svelte';
	import { ToastType } from '../enums/Enums';
	import Card from '../base/card.svelte';
	import Form from '../base/form.svelte';
	import { showError, showToast } from '../../functions/utils';
	import { InstrumentoMusica, type DBTable } from '../classes/classes';
	import Input from '../base/input.svelte';
	import { invalidateAll } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import FormButtons from '../base/formButtons.svelte';

	export let data : any = { response: new InstrumentoMusica({}) }

	export let layout = 'md'
	export let singleCol : boolean = false
	export let defaultEdit = true;
	export let borderless = false;

	let response : InstrumentoMusica = data.response

	$: (()=>{response = data?.response || data})()
	let writing = (data?.response || data).id == null || !defaultEdit

	let url = "/instrumento-musica"

	let loading : boolean = false
	let dispatcher = createEventDispatcher()
	let isEdit : boolean = false

	function validate(v : DBTable) {
		isEdit = v.id != undefined
		return [true, '', v]
	}

	function load(e : any) {
		loading = e.detail
	}

	function finish(e : any) {
		loading = false
		if (!e.detail.ok) {
			console.log(e.detail)
			showError('Erro ao salvar', e.detail.message);
			invalidateAll()
			return;
		}

		showToast('Registro salvo', '', ToastType.success)

		if (writing = !isEdit) {
			response = (data = { response: new InstrumentoMusica({}) }).response
		}

		dispatcher('success', {record: e.detail.body})	
		
		invalidateAll()
	}


</script>

<Form {url} body={response} key="id"
{borderless}
{validate}
on:loading={load}
on:finish={finish}>
	<Card title={response.nome} className="h-full overflow-auto {response.id && !borderless ? '' : 'card-no-frame'}" >
		<div slot="actions">
			<FormButtons {url} {data} bind:response={response} bind:writing={writing} bind:loading={loading} ></FormButtons>
		</div>
		<div class="overflow-auto h-full">
			<div class="form-layout {singleCol ? 'single-grid-col' : ''}">
				<Input label="Nome Posição" name="nome" placeholder="Digite" size={layout} bind:value={response.nome} disabled={!writing} {url} required/>
                <Input label="Posição X" name="posX" type="number" size={layout} bind:value={response.posX} disabled={!writing} {url} required/>
				<Input label="Posição Y" name="posY" type="number" size={layout} bind:value={response.posY} disabled={!writing} {url} required/>
                <Input label="Tamanho X" name="tamX" type="number" size={layout} bind:value={response.tamX} disabled={!writing} {url} required/>
				<Input label="Tamanho Y" name="tamY" type="number" size={layout} bind:value={response.tamY} disabled={!writing} {url} required/>
				<Input label="Incluir Nome Tocador" name="terTocador" type="checkbox" size={layout} bind:checked={response.terTocador} disabled={!writing} {url} required/>
			</div>

			<slot/>

		</div>
	</Card>
</Form>

<Spinner {loading}/>
