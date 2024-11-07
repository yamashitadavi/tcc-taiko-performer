<script lang="ts">
	import Spinner from '../base/spinner.svelte';
	import { ToastType } from '../enums/Enums';
	import Card from '../base/card.svelte';
	import Form from '../base/form.svelte';
	import { showError, showToast } from '../../functions/utils';
	import { Apresentacao, type DBTable } from '../classes/classes';
	import Input from '../base/input.svelte';
	import { invalidateAll } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import FormButtons from '../base/formButtons.svelte';

	export let data : any = { response: new Apresentacao({}) }

	export let layout = 'md'

	let response : Apresentacao = data.response || data
	export let writing = (data.response || data).id == null

	let url = "/apresentacoes"

	export let loading : boolean = false
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
		console.log('finished')
		if (!e.detail.ok) {
			console.log(e.detail)
			showError('Erro ao salvar', e.detail.message);
			invalidateAll()
			return;
		}

		showToast('Registro salvo', '', ToastType.success)

		if (writing = !isEdit) {
			response = (data = { response: new Apresentacao({}) }).response
		}

		dispatcher('success', {record: e.detail.body})	
		
		invalidateAll()
	}


</script>

<Form {url} body={response} key="id"
{validate}
on:loading={load}
on:finish={finish}>
	<Card title={response.nome} className="h-full overflow-auto {response.id ? '' : 'card-no-frame'}" >
		<div slot="actions">
			<FormButtons {url} {data} bind:response={response} bind:writing={writing} bind:loading={loading} on:cancel></FormButtons>
		</div>
		<div class="overflow-auto h-full">
			<div class="form-layout">
				<Input label="Nome" name="nome" placeholder="Digite" size={layout} bind:value={response.nome} disabled={!writing} {url} required/>
				<Input label="Data/Hora" name="dataHoraTZ" type="datetime-local" size={layout} bind:value={response.dataHoraTZ} disabled={!writing} {url} required/>
				<Input label="Local" name="local" placeholder="Digite" size={layout} bind:value={response.local} disabled={!writing} {url} required/>
				<Input label="Observações" name="observacoes" placeholder="Digite" size={layout} bind:value={response.observacoes} disabled={!writing} {url} />
			</div>

			<slot/>

		</div>
	</Card>
</Form>

<Spinner {loading}/>
