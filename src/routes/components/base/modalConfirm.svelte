<script lang="ts">
	import { createEventDispatcher } from 'svelte';
    export let data : any = {}
    export let open = false

    const dispatcher = createEventDispatcher();
</script>
<dialog id="modal-confirm" class="modal  top-0 bottom-0 left-0 right-0" class:modal-open={open} open={open}>
    <div class="modal-box border border-base-300">
        <h1 class="text-center font-bold text-xl border border-transparent border-b-neutral pb-4">{data.title ?? ''}</h1>
        <p class="text-center py-4 text-lg">{data.body ?? ''}</p>
        <div class="modal-action">

            <button class="btn btn-error" type="button" on:click={()=>open = false}>Cancelar</button>
            <button class="btn btn-primary" type="button" on:click={()=>{open = false; dispatcher('confirm')}}>Confirmar</button>

        </div>
    </div>
</dialog>