<script lang="ts">
	import Body from "../components/base/body.svelte";
	import Checklist from "../components/base/checklist.svelte";
	import FormApresentacao from "../components/forms/formApresentacao.svelte";


    export let data : any
    let tocadores : any = []
    let deletedTocadores : any = []
</script>
<Body>
    <FormApresentacao data={data}>
        <Checklist label="Checklist Tocadores"
        url="/tocadores" relationUrl="/tocador-apresentacao" 
        relatedObject="tocador" 
        relationFilter={{
            "fields": { "id": true, "tocadorId": true, "apresentacaoId": true },
            "include": ["tocador"],
            "where": { "apresentacaoId": data.id } 
        }} 
        bind:value={tocadores}
        bind:deletedRelations={deletedTocadores}/>
    </FormApresentacao>
</Body>
