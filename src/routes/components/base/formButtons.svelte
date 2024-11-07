<script lang="ts">
	import ModalConfirm from './modalConfirm.svelte';
	import { deleteRowTable } from "../../functions/request";
	import { customRedirect, showError } from "../../functions/utils";
	import { createEventDispatcher } from 'svelte';

    export let writing : boolean
    export let loading : boolean
    export let canDelete : boolean = true
    export let data : any
    export let response : any
    export let url : string

    const dispatcher = createEventDispatcher()

    let deleteModal = false;

    function cancel() {
        writing = false;
        response = (data?.response || data);
        dispatcher('cancel')
    }

    async function del() {
        loading = true
        let { ok, message } = await deleteRowTable(url, fetch, (data?.response || data).id)
        if (!ok) {
            showError('Erro ao salvar', message);
            return
        }
        customRedirect('?recordDeleted=true')
    }
</script>
{#if writing}
    <button class="btn btn-primary btn-sm md:btn-md" data-submit="true" type="submit" disabled={loading}>Salvar</button>
    {#if (data?.response || data).id != null}	
    <button class="btn btn-error btn-sm md:btn-md" disabled={loading} on:click={cancel}>Cancelar</button>
    {/if}
{:else}
    {#if canDelete}
        <button class="btn btn-error btn-sm md:btn-md" type="button" disabled={loading} on:click={()=>deleteModal = true}>Deletar</button>
        <ModalConfirm data={{title: 'Deseja deletar o registro?', body: 'Essa ação é irreversível.'}} bind:open={deleteModal} on:confirm={del}></ModalConfirm>
    {/if}
    <button class="btn btn-primary btn-sm md:btn-md" disabled={loading} on:click={()=>writing = true}>Editar</button>
{/if}