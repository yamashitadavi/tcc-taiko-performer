<script lang="ts">
	import Spinner from './../base/spinner.svelte';
	import { ToastType } from '../enums/Enums';
	import Card from '../base/card.svelte';
	import Form from '../base/form.svelte';
	import { showError, showToast } from '../../functions/utils';
	import { Tocador, type DBTable } from '../classes/classes';
	import Input from '../base/input.svelte';
	import { invalidateAll } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import FormButtons from '../base/formButtons.svelte';

	export let data : any = { response: new Tocador({}) }

	export let layout = 'md'

	let response : Tocador = data.response
	let writing = data.response.id == null

	let url = "/tocadores"

	let loading : boolean = false
	let dispatcher = createEventDispatcher()
	let isEdit : boolean = false

	function validate(v : any) {
		isEdit = v.id != undefined
		let now = new Date()
		now = new Date(new Date().getFullYear(), now.getMonth(), now.getDate());
		if (v.dataEntrada && new Date(v.dataEntrada.replace('z','')).getTime() > now.getTime()) {
			return [false, 'Data de Entrada é maior que hoje', v]
		}

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
			response = (data = { response: new Tocador({}) }).response
		}

		dispatcher('success', {})	
		
		invalidateAll()
	}


</script>

<Form {url} body={response} key="id"
{validate}
on:loading={load}
on:finish={finish}>
	<Card title={response.nome} className="h-full overflow-auto {response.id ? '' : 'card-no-frame'}" >
		<div slot="actions">
			<FormButtons {url} {data} bind:response={response} bind:writing={writing} bind:loading={loading} ></FormButtons>
		</div>
		<div class="overflow-auto h-full">
			<div class="form-layout">
				<Input label="Nome" name="nome" placeholder="Digite" size={layout} bind:value={response.nome} disabled={!writing} {url} required/>
				<Input label="Data de Entrada" name="dataEntrada" type="date" size={layout} bind:value={response.dataEntrada} disabled={!writing} {url} required/>
			</div>

			<slot/>

		</div>
	</Card>
</Form>

<Spinner {loading}/>
