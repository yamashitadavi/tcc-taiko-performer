<script lang="ts">
	import { Apresentacao, MusicaApresentacao, TocadorApresentacao, TocadorMusica } from './../../components/classes/classes';
	import { showError } from '../../functions/utils';
	
	import Checklist from './../../components/base/checklist.svelte';
	import Body from '../../components/base/body.svelte';
	import FormApresentacao from '../../components/forms/formApresentacao.svelte';
	import { deleteRowTable, upsertTable } from '../../functions/request';
	import Card from '../../components/base/card.svelte';
	import MapaPalcoTocadores from '../../components/base/mapaPalcoTocadores.svelte';
	import { onMount } from 'svelte';
    export let data : any
    export let writing : boolean

    let tocadores : any = [],
    deletedTocadores : any = [],
    valueRelations : any = {},
    loading : boolean,
    apresentacao : any = new Apresentacao(data.response.apresentacao),
    musApreJunct : any = [],
    setValue : Function,
    loadComponent : any,
    musicaToDelete : any = {};

    
    function onCancel() {
        let tocs = []
        for (const k in valueRelations) {
            tocs.push(valueRelations[k]?.tocador)
        }
        setValue(tocadores = tocs)
        deletedTocadores = []
        apresentacao = new Apresentacao(data.response.apresentacao),
        musApreJunct = [...data.response.musApreJunct]
    }

    async function onSuccess(dt : any) {
        const valres : any = valueRelations,
        tocs : any = []

        tocadores.forEach((e : any) => {
            if (!valres[e.id]) {
                tocs.push(upsertTable('/tocador-apresentacao', new TocadorApresentacao({tocadorId: e.id, apresentacaoId: dt.detail.record.id}).toDb(), fetch))
            }
        });

        let res : any = await Promise.all([
            ...deletedTocadores.map((e : any) => deleteRowTable('/tocador-apresentacao', fetch, valres[e].id)),
            ...tocs
        ])

        res.forEach((rec : any) => {
            if (!rec.ok) {
                showError('Erro', rec.message)
                writing = true
                return
            }
            if (rec.body) {
                valueRelations[rec.body.tocadorId] = rec.body
            }
        });

        deletedTocadores.forEach((e : any) => { delete valres[e] });

        await Promise.all(Object.keys(musicaToDelete).map((e : any) => deleteRowTable('/musica-apresentacao', fetch, e)))

        const olds = data.response.musApreJunct

        const musMaps = (await Promise.all(musApreJunct.map((e : any, i : any) => {
            e.musicaApre.ordem = i
            let toUpsert = new MusicaApresentacao(e.musicaApre)
            delete toUpsert.musica
            return upsertTable('/musica-apresentacao', toUpsert, fetch, e.musicaApre.id)
        }))).map(({ body, ok } : any) => {
            return ok ? body : {}
        })

        const tocsUpsert = [],
        doNotDelete = [],
        tocsDelete = []

        for (let i = 0; i < musApreJunct.length; i++) {
            const mp = musMaps[i],
            old =  mp.id !== undefined ? olds.find((e : any) => mp.id == e.musicaApre.id) : undefined;

            const muApreJ = musApreJunct[i];
            muApreJ.musicaApre.id = mp.id

            for (let [ imId, toc ] of Object.entries(muApreJ.tocadores)) {
                if (old && old[imId]) {
                    doNotDelete.push(toc.id = old[imId].id)
                }
                toc.musicaApresentacaoId = mp.id
                tocsUpsert.push(toc)
            }
            
        }

        for (let i = 0; i < musApreJunct.length; i++) {
            const muApreJ = musApreJunct[i];
            if (muApreJ.toDelete) {
                for (let toc of muApreJ.toDelete) {

                    if (!doNotDelete.includes(toc.id)) tocsDelete.push(deleteRowTable('/tocador-musica', fetch, toc.id))
                }
            }
        }

        await Promise.all(tocsDelete);

        (await Promise.all(tocsUpsert.map((e : any, i : any) => {
            let toUpsert = new TocadorMusica(e)
            delete toUpsert.tocador;
            return upsertTable('/tocador-musica', toUpsert, fetch, e.id)
        }))).forEach(({ body, ok, message} : any) => {

            if (ok) {
                musApreJunct.find((e : any) => e.musicaApre.id == body.musicaApresentacaoId).tocadores[body.instrumentoMusicaId+''].id = body.id
            }
        })

        musApreJunct = musApreJunct

        loading = false
    }

    onMount(async () => {
        
        await loadComponent()
        musApreJunct = [...data.response.musApreJunct]
    })

</script>
<Body>
    <FormApresentacao data={apresentacao} bind:loading={loading} bind:writing={writing} on:success={onSuccess} on:cancel={onCancel}>
        <!--to fix: on save list is undefined-->
        
        <Checklist label="Checklist Tocadores" url="/tocadores" relationUrl="/tocador-apresentacao" 
        relatedObject="tocador" readonly={!writing} 
        
        relationFilter={{
            "fields": { "id": true, "tocadorId": true, "apresentacaoId": true },
            "include": ["tocador"],
            "where": { "apresentacaoId": apresentacao.id } 
        }} 
        bind:loadComponent = {loadComponent}
        bind:setValue={setValue}
        bind:valueRelations={valueRelations}
        bind:value={tocadores}
        bind:deletedRelations={deletedTocadores}/>

        <div class="w-full h-full p-2 md:p-4 " >
			<Card className="w-full h-full card-no-actions relative">
                <MapaPalcoTocadores bind:apresentacao={apresentacao} bind:musApreJunct={musApreJunct} editing={writing} bind:tocadores={tocadores} bind:toDelete={musicaToDelete} bind:loading={loading}/>
            </Card>
        </div>
    </FormApresentacao>
</Body>
