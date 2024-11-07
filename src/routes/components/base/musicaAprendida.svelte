<script lang="ts">
	import Expand from './../icons/expand.svelte';
	import Card from './card.svelte';
	import SearchDropdown from './searchDropdown.svelte';
	import Search from '../icons/search.svelte';
	import X from '../icons/x.svelte';
	import { upsertTable, deleteRowTable } from '../../functions/request';
	import { MusicaAprendida } from '../classes/classes';
	import { showToast } from '../../functions/utils';
	import { ToastType } from '../enums/Enums';

    export let musicaId : number;
    export let instrMus : any;
    export let tocadorInstr : any = {} //tocadorId : {value: { instrMuId: musicaApreId }, label : 'tocador'}
    export let disabled : boolean = false;

    export let searchTocadores : string = ''
    export let reloadTocador : any
    
    let toHide : any = []
    
    let instrumento : any = {},
    tocador : any = {},
    tocadorFilter : any = '',
    displayList : any = [], //id: tocadorId, label: tocador.nome, value: Map<inMusLabel, [{ inMusId, musAprId }]>, dispaly
    displayExpand : any = {},
    clearInsValue : any,
    instrMusMap : any;

    $: updateInsMap(instrMus)

    function updateInsMap(instrMus : any) {

        instrMusMap = instrMus.reduce((acc : any, val : any) => {
            acc[val.id] = val.nome
            return acc
        }, {})

    }

    $: updateInstrMap(tocadorFilter, tocadorInstr, instrMusMap)

    function updateInstrMap(tocFilter : any, tocadorInst : any, instrMusMa : any) {
        console.log('roda')
        let tocs = [], filter = tocFilter.toLowerCase()
        
        for (let k in tocadorInst) {
            const { value, label } = tocadorInst[k];
            tocs.push({
                id: k, label, value:
                    
                    Object.keys(value).reduce((acc : any, inMus : any) => {
                        const inMusLbl = instrMusMa[inMus]

                        if (!acc.has(inMusLbl)) acc.set(inMusLbl, [])

                        acc.get(inMusLbl).push({ musicaAprenIds: value[inMus], instrMusId: inMus })
                        return acc
                    }, new Map<String, any>()), 
                    
                display: !filter.length || label.toLowerCase().includes(filter)
            })
        }
        displayList = tocs
    }

    $: (() => { 
        const toc = tocadorInstr[tocador.value];
        toHide = (toc?.value) ? Object.keys(toc.value) : []
    })()
    
    async function addRelation() {
        //save new musica-aprendida(tocadorId, instrumentoMusicaId, musicaId)
        //clear instrumentoMusica selecionado
        //adiciona a lista de exclusao

        //identify multiples value in

        let responses = (await Promise.all(( typeof instrumento.value == 'string' ? instrumento.value.split(';').map(Number) : [ instrumento.value ]).map((e : any)=> 
        upsertTable('/musica-aprendida', new MusicaAprendida({ musicaId, tocadorId: tocador.value, instrumentoMusicaId: e }), fetch))))

        if (responses.every((e) => e.ok)) {

            !tocadorInstr[tocador.value] && (tocadorInstr[tocador.value] = { value: { }, label: tocador.label })
            
            responses.forEach(e => {
                tocadorInstr[tocador.value].value[e.body.instrumentoMusicaId] = e.body.id
            })

            clearInsValue();
        }
    }

    async function removeRelation(musicaAprenIds : any, tocadorId : any) {

        if ((await Promise.all(musicaAprenIds.map((e : any)=> deleteRowTable('/musica-aprendida', fetch, e.musicaAprenIds)))).every(e => e.ok)) {
            musicaAprenIds.forEach((e : any) => {
                delete tocadorInstr[tocadorId].value[e.instrMusId]
            });
            
            tocadorInstr = tocadorInstr
            
            showToast('Deletado com sucesso','', ToastType.success)
        }
    }

   
</script>

<div class="md:form-control md:flex-row h-full overflow-y-auto">
    <menu class="form-control gap-4 basis-1/4 bg-base-200 p-4 pb-6 shadow-md md:border-r md:border-r-neutral ">
        <!-- <h1 class="text-xl">Tocadores</h1> -->
        <SearchDropdown label="Tocadores" className="w-full" url="/tocadores" clearable bind:searchSelection={searchTocadores} bind:value={tocador} {disabled} />
        <SearchDropdown label="Instrumentos" className="w-full" url="/instrumento-musica" condition={{terTocador: true, musicaId}} uniqueLabel 
        bind:reload={reloadTocador} bind:value={instrumento} bind:clearValue={clearInsValue} 
        exclude={toHide} disabled={!tocador.value || disabled}/>
        
        <button class="btn btn-accent mt-4" on:click={addRelation} disabled={!instrumento.value || disabled}>Adicionar</button>
    </menu>
    <div class="basis-3/4 flex flex-col">
        <label class="sticky top-0 md:relative md:top-auto z-20">
            <input placeholder="Buscar tocadores" class="input-md outline-offset-0 outline-0 bg-base-300 w-full" bind:value={tocadorFilter}>
            <div class="absolute right-0 top-0 h-full px-4 items-center flex">
                <Search className="h-4 w-4 opacity-70"/>
            </div>
        </label>
        <div class="md:grid items-start h-full p-2 flex-grow md:overflow-auto" style="grid-template-columns: repeat(auto-fill, 33%); grid-template-rows: min-content;">
            {#each displayList as l (l.id)}
            <div class="p-2" class:h-[300px]={displayExpand[l.id]} class:hidden={!l.display}>
                <Card className="card-no-actions h-full" >
                    <button class="flex flex-row w-full bg-base-200 items-center btn-ghost border-b border-b-neutral" on:click={()=>{
                        displayExpand[l.id] = !displayExpand[l.id]
                    }}>
                        <div class="font-bold pl-4 mr-auto">
                            {l.label}
                        </div>   
                        <div class="p-2">
                            <Expand/>
                        </div>            
                    </button>
                    <!-- body -->
                    <ul class="menu" class:hidden={!displayExpand[l.id]}>
                        {#each l.value.entries() as [k, v] (k)}
                        {#if k !== undefined}
                        <li class="flex flex-row items-center">
                            <span class="flex-grow bg-none">{k}</span>
                            <button class="btn-ghost p-1 disabled:cursor-not-allowed" on:click={()=>removeRelation(v, l.id)} disabled={disabled}>
                                <X className="text-red-400"/>
                            </button>
                        </li>
                        {/if}
                        {/each}
                    </ul>
                </Card> 
             </div>
            {/each}
        </div>
    </div>
</div>
<!-- <button class="absolute bottom-0">Voltar ao Começo</button> -->