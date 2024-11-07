<script lang="ts">
    import { getTable } from '../../functions/request';
	import { isEmptyOrWhitespace } from '../../functions/utils';
	import X from '../icons/x.svelte';

    export let searchKey = 'nome';
    export let valueKey = 'id';
    export let url: string;
    export let label : string = ''
    export let value : any = [];
    export let required = false;
    export let readonly = false;
    export let relationFilter : any;
    export let relatedObject : string;
    export let relationUrl : string;
    export let deletedRelations : any = [] // valueKey
    export let valueRelations : any = {} //relationKey : relatedObject{}
    export const setValue : Function = (val : any) => {
        value = val;
        handleInput()
    }

    let searchSelection = '',
    oldSearchSelection = '',
    searchSelected = '',
    searching = false,
    needSearch = false,
    initialList : any = [],
    list : any = [],
    displayList: any = [],
    myTimeout: any,
    valueKeys = new Set(),
    boxExpanded : boolean = false


    $: filterValue = (() => searchSelected ? value.filter((e : any)=> (e[searchKey] ?? '').toLowerCase().includes(searchSelected.toLowerCase())) : value)(); 

    function handleInput() {

        clearTimeout(myTimeout);

        if (isEmptyOrWhitespace(searchSelection) || searchSelection.length < 2) {

            displayList = initialList.map((e : any) => {
                e.hidden = !!valueRelations[e[valueKey]] && !deletedRelations.includes(e[valueKey])
                return e
            });
            
            list = displayList = displayList;
            return
        }

        
        if (needSearch && !oldSearchSelection.startsWith(searchSelection)) {
            searching = true
            myTimeout = setTimeout(async () => {
                
                await loadData();
                
            }, 400);
            return
        }

        searching = false;
        oldSearchSelection = searchSelection;
        displayList = list.filter((e : any)=>(e[searchKey] ?? '').toLowerCase().includes(searchSelection.toLowerCase()))

    }

    async function loadData(initialLoad? : boolean) {
        try {

            let filters: any = { where: {}, fields: {}, limit: 100 };
            if (!initialLoad) filters.where[searchKey] = { like: `%${searchSelection}%` };                
            filters.fields[valueKey] = filters.fields[searchKey] = true;

            let { response } = await getTable(url, filters, fetch);

            oldSearchSelection = searchSelection;
            displayList = list = response.map((e : any) => {
                e.hidden = !!valueRelations[e[valueKey]] && !deletedRelations.includes(e[valueKey])
                return e
            });

            if (initialLoad) needSearch = (initialList = list).length == 100;
                
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
        searching = false;
    }

    async function getRelated() {
        try { 
            searching = true
            let { response } = await getTable(relationUrl, relationFilter, fetch);
            let vals :any = []
            response.forEach((e : any) => {
                valueRelations[e[relatedObject][valueKey]] = e;
                vals.push(e[relatedObject])
            });
            value = vals
        } catch (error) {
            console.error("Erro ao buscar relacionados:", error);
        }
    }


    export const loadComponent = (async () => {await getRelated(); await loadData(true);})

</script>

<div class="flex flex-col md:flex-row w-full h-auto gap-4 form-layout" class:h-full={boxExpanded}>

    {#if !readonly}
        <div class="form-control flex-grow gap-2" >

            <label class="form-control w-full h-auto flex" title={label}>
                <div class="label truncate">
                    <span class="label-text">
                        {#if label}    
                            {label}
                            {#if required}
                            <span class="text-red-500">*</span>
                            {/if}
                        {:else} 
                            &#8205;
                        {/if}
                    </span>
                </div>
                <div class="w-full grow flex relative">
                    <input type="text" class="w-full input input-bordered input-md" placeholder="Buscar" on:keyup={handleInput} bind:value={searchSelection} />
                    <div class="absolute right-0 top-0 h-full px-4 items-center flex">
                        {#if searching}
                            <span class="loading loading-sm"></span>
                        {:else}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                class="h-4 w-4 opacity-70">
                                <path
                                    fill-rule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clip-rule="evenodd" />
                            </svg>
                        {/if}
                    </div>
                </div>
              
            </label>
            
            <ul class="form-control input input-bordered dropdown-content menu z-[1] shadow overflow-y-auto relative" style:height={boxExpanded ? '100%' : '300px'}>
                {#each displayList as l}
                    <li>
                        <button type="button" class="btn-ghost" class:hidden={l.hidden} title={l[searchKey]} on:click={()=>{
                            value.push(l)
                            value = value
                            l.hidden = true
                            displayList = displayList
                            if (deletedRelations.length && deletedRelations.includes(l[valueKey])) {
                                deletedRelations = deletedRelations.filter(e=>e!= l[valueKey])
                            }
                        }}>{l[searchKey]}</button>
                    </li>
                {/each}
            </ul>

        </div>
    {/if}

    <div class="form-control flex-grow gap-2">
        <label class="form-control w-full h-auto flex" title={label}>
            <div class="label truncate hidden md:block">
                <span class="label-text">
                    {#if readonly}
                        {label}
                    {:else}
                        &#8205;
                    {/if}
                </span>
            </div>

            <div class="w-full grow flex relative">
                <input type="text" class="w-full input input-bordered input-md" placeholder="Buscar" on:keyup={()=>{

                }} bind:value={searchSelected} />
                <div class="absolute right-0 top-0 h-full px-4 items-center flex">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                    <path
                        fill-rule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </label>

        <ul class="form-control input input-bordered menu z-[1] shadow overflow-y-auto " class:input-disabled={readonly} style:height={boxExpanded ? '100%' : '300px'}>
            {#each filterValue as l, i (l[valueKey])}
                <li class="flex flex-row items-center">
                    <span class="flex-grow">{l[searchKey]}</span>
                    <button class="btn-ghost p-1" class:hidden={readonly} on:click={()=>{
                        const val = l[valueKey];
                        valueKeys.delete(val);
                        
                        value.splice(i, 1);
                        value = value;

                        (displayList.find(e => e[valueKey] == val) ?? {}).hidden = false;

                        displayList = displayList

                        searchSelected = ''
                        if (valueRelations[val]) {
                            deletedRelations.push(val)
                        }
                    }}><X className="text-red-400"/></button>
                </li>
            {/each}
        </ul>
    </div>
    

</div>


