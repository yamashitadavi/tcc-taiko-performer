<script lang="ts">
	import FormButtons from './../base/formButtons.svelte';
	import Spinner from '../base/spinner.svelte';
	import { ToastType } from '../enums/Enums';
	import Card from '../base/card.svelte';
	import Form from '../base/form.svelte';
	import { renameFile, showError, showToast } from '../../functions/utils';
	import { Instrumento,  type DBTable } from '../classes/classes';
	import Input from '../base/input.svelte';
	import { invalidateAll } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import X from '../icons/x.svelte';

	export let data : any = { response: new Instrumento({}) }

	export let layout = 'md';
	export let singleCol : boolean = false;
	export let defaultEdit = true;
	export let borderless = false;
	export let alwaysWrite = false;
	export let form : any = {};

	export let response : Instrumento = data?.response || data;
	$: (()=>{response = data?.response || data})();
	$: writableRes = (data?.response || data).id == null

	let writing = writableRes || !defaultEdit;

	let url = "/instrumentos";
	let formDataUrl = '/instrumentos/icone';

	let loading : boolean = false;
	let dispatcher = createEventDispatcher();
	let isEdit : boolean = false;

	let changingFile : boolean = !(response.files?.length || response._imagem);
	let removeFile : boolean = false

	$: (()=>{
		changingFile = !(response.files?.length || response._imagem);
			
	})();

	let cachedSizeX : number = 0;
	let cachedSizeY : number = 0;


	function validate(v : Instrumento) {
		isEdit = v.id != undefined;
		let newVal = {...v};
		//v.tipoImagem = newVal.files[0].name.split('.').pop()
		delete newVal.files
		return [true, '', newVal, true];
	}

	function load(e : any) {
		loading = e.detail;
	}

	function finish(e : any) {
		loading = false;
		console.log('finish', e);

		if (!e.detail.ok) {
			console.log(e.detail);
			showError('Erro ao salvar', e.detail.message);;
			invalidateAll();
			return;
		}

		showToast('Registro salvo', '', ToastType.success)

		if (writing = !isEdit && defaultEdit) {
			response = (data = { response: new Instrumento({}) }).response;
		} else {
			if (alwaysWrite) writing = true;
			(data?.response || data).id = e.detail.body.id;
		}

		dispatcher('success', {record: e.detail.body});
		
		invalidateAll();
	}

	function beforeFormData(reqBody : any, resp : any) {
		if (!reqBody.files) return false;
		reqBody.files = renameFile(reqBody.files, resp.body.id+'.'+reqBody.files[0].name.split('.').pop());
		let formData = reqBody.toFormData();
		return formData;
	}
	
	function changeImage(e : any) {
		removeFile = false
		changingFile = false		
		const fil = response.files[0];
		const objectUrl = URL.createObjectURL(fil);
		response.tipoImagem = fil.name.split('.').pop();
		response._imagem = objectUrl;
		console.log(response.tamX, response.tamY)
		if ((+response.tamX == 0 || +response.tamY == 0) || (cachedSizeX == +response.tamX && cachedSizeY == +response.tamY)) {
			const img = new Image();
			img.onload = function () {
				response.tamX = (cachedSizeX=img.width)+'';
				response.tamY = (cachedSizeY=img.height)+'';
			};
			img.src = objectUrl;
		}
		dispatcher('changeimage', objectUrl)
	}

</script>

<Form bind:form={form} {url} {formDataUrl} {borderless} bind:body={response} disableEnter={!writableRes} key="id"
enctype="multipart/form-data"
{beforeFormData}
{validate}
on:loading={load}
on:finish={finish}>
	<Card title={response.nome} className=" overflow-auto {response.id && !borderless ? 'h-full' : 'card-no-frame'}" >
		<div slot="actions">
			<FormButtons {url} {data} bind:response={response} bind:writing={writing} bind:loading={loading} ></FormButtons>
		</div>
		<div class="overflow-auto {response.id && !borderless ? 'h-full' : ''}">
			<div class="form-layout" class:single-grid-col={singleCol}>
				<Input label="Nome" name="nome" placeholder="Digite" size={layout} bind:value={response.nome} disabled={!writing} {url} required on:change on:blur/>
				
				{#if changingFile || removeFile}
					<Input label="Ícone" name="files" type="file" size={layout} bind:file={response.files} accept="image/*" disabled={!writing} {url} required={!response.id} 
					on:input={changeImage} />
				{:else}
					<div>
						<div class="label truncate">
							<span class="label-text">
								Ícone
								<span class="text-red-500">*</span>
							</span>
						</div>
						<div class="flex flex-row items-center join bg-base-200 overflow-hidden border border-base-content border-opacity-20">
							<input class="flex-grow min-w-0 pl-3 join-item bg-transparent outline-none disabled:text-opacity-20 disabled:border-transparent" value={response.files[0]?.name ?? (response.id+'.'+response.tipoImagem)} disabled>
							<button class="btn btn-error min-w-0 flex-none p-2 join-item btn-{layout}" title="Alterar arquivo" on:click={()=>{
								removeFile = true
								console.log('alterar')
							}} disabled={!writing}>
								<X className="w-[16px] h-[16px]" />
							</button>
						</div>
					</div>
				{/if} 
				
				<Input label="Tamanho X (Padrão)" name="tamX" type="number" size={layout} bind:value={response.tamX} disabled={!writing} {url} required on:change on:blur/>
				<Input label="Tamanho Y (Padrão)" name="tamY" type="number" size={layout} bind:value={response.tamY} disabled={!writing} {url} required on:change on:blur/>
			</div>

			<slot/>

		</div>
	</Card>
</Form>

<Spinner {loading}/>
