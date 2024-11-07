<script lang="ts">
	import { onDestroy } from "svelte";

    let data : any = {}
    let open = false

    const eventHandler = (event : any) => {
        data = event.detail || {}
        open = true
    };

    window.addEventListener('modal-error', eventHandler);  

    onDestroy(() => {
        window.removeEventListener('modal-error', eventHandler);
    });
    
</script>
<dialog id="modal-error" class="modal  top-0 bottom-0 left-0 right-0" class:modal-open={open} open={open}>
    <div class="modal-box border border-base-300">
        <h1 class="text-center font-bold text-2xl text-error border border-transparent border-b-error pb-4">{data.title}</h1>
        <p class="text-center py-4 text-error">{data.body}</p>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn btn-error" on:click={()=>open = false}>Fechar</button>
            </form>
        </div>
    </div>
</dialog>