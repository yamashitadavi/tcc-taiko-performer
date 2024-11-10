<script lang="ts">
	import Search from './../icons/search.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
    import { getTable } from '../../functions/request';
	import { isEmptyOrWhitespace } from '../../functions/utils';

    export let searchKey = 'nome';
    export let valueKey = 'id';
    export let url: string = '';
    export let value : any = { label: '', value: '' };
    export let condition : any = {};
    export let exclude: any = [];
    export let data: any|undefined = undefined;
    export let className = '';
    export let label : string = '';
    export let required : boolean = false;
    export let disabled : boolean = false;
    export let clearable : boolean = false;
    export let uniqueLabel : boolean = false;
    export let uniqueSeparator : string = ';';
    export let size : string = 'md';
    export let additionalFields : any = {}
    export let searchSelection = ''
    export const clearValue : any = () => { oldSearchSelection = searchSelection = currentSelected = ''; value = { label: '', value: '' }}
    export const reload : any = async () => { await loadData(true); }
    
    let oldSearchSelection = '',
    currentSelected = '',
    searching = false,
    needSearch = false,
    initialList : any = [],
    list : any = [],
    displayList: any = [],
    myTimeout: any, 
    updated : any = [];

    $: (() => {
        let current = (data ?? displayList) ?? [],
        at = exclude
        if (uniqueLabel) {
            let newCurrent = [],
            currentMap = current.reduce((acc : any, e : any) => {
                let val = acc[e[searchKey]]
                
                acc[e[searchKey]] = (val === undefined) ? e[valueKey] : val + uniqueSeparator + e[valueKey]
                return acc
                
            }, {})

            for (let k in currentMap) {
                let obj : any = {}
                obj[searchKey] = k
                obj[valueKey] = currentMap[k]
                newCurrent.push(obj)
            }
            current = newCurrent;
        }
        updated = current.filter((e : any) => !hasExclude(e[valueKey]))
    })()
    $: (() => { 
        if (hasExclude(value.value)) clearValue()
        
    })()


    const dispatch = createEventDispatcher()    

    function hasExclude(val : string) {
        return uniqueLabel && (val+'').includes(uniqueSeparator) ? !val.split(uniqueSeparator).every((s : any) => !exclude.includes(s)) : exclude.includes(val+'');
    }

    function handleInput() {

        clearTimeout(myTimeout);

        dispatch('input', searchSelection)
        if (isEmptyOrWhitespace(searchSelection) || searchSelection.length < 2) {
            displayList = initialList
            displayList = displayList
            list = initialList;

            if (!(oldSearchSelection = searchSelection) && clearable) {

                value = { label: '', value: '' }
            }
            return
        }

        
        if (searching = needSearch && !oldSearchSelection.startsWith(searchSelection) && data?.length) {
           
            myTimeout = setTimeout(async () => {
                
                await loadData();
                
            }, 400);
            return
        }

        oldSearchSelection = searchSelection;

        displayList = list.filter((e : any)=>(e[searchKey] ?? '').toLowerCase().includes(searchSelection.toLowerCase()))

    }
    
    async function loadData(initialLoad? : boolean) {
        let filters: any = { where: {...condition}, fields: {...additionalFields}, limit: 100 };
        if (!initialLoad) filters.where[searchKey] = { like: `%${searchSelection}%` };                
        filters.fields[valueKey] = filters.fields[searchKey] = true;
        console.log(url, filters)
        let { response } = await getTable(url, filters, fetch);
        console.log('response', response)
        oldSearchSelection = searchSelection;
        displayList = list = response

        if (initialLoad) needSearch = (initialList = list ?? []).length == 100;
                
        searching = false;
    }

    onMount(async() => {
        if (!data) await loadData(true);    
    })

</script>

<div class="dropdown {className} " >
    <label class="form-control w-full h-auto flex">
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
        <div class="w-full grow flex relative overflow-hidden">
            <input type="text" class="input input-bordered {'input-'+size} grow min-w-0" placeholder="Buscar" on:keyup={handleInput} 
            bind:value={searchSelection} {disabled} on:blur={()=>{ if (value.value && oldSearchSelection && (!clearable || searchSelection)) {
             
             searchSelection = currentSelected
            } else if (value.value && !searchSelection.length) {
                clearValue()
                dispatch('select', {value: '', searchSelection});
            }
            }}/>
            <div class="absolute right-0 top-0 h-full { size != 'sm' ? 'px-4' : 'px-2' } items-center flex">
                {#if searching}
                    <span class="loading loading-md"></span>
                {:else}
                    <Search className="h-4 w-4 opacity-70"/>
                {/if}
            </div>
        </div>
    </label>

    <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow-md mt-2 max-h-56 flex-nowrap overflow-auto" class:hidden={searchSelection.length < 3 && updated.length == 0}>
        {#each updated as l}
            <li>
                <button class="btn-ghost" class:py-1={size == 'sm'} title={l[searchKey]} on:click={(e)=>{
                    value = { label: l[searchKey], value : l[valueKey], ...l };
 
                    currentSelected = searchSelection = l[searchKey];
                    dispatch('select', {value, searchSelection});
                    e.target.blur()

                }}>{l[searchKey]}</button>
            </li>
        {/each}
        {#if updated.length == 0 && searchSelection.length > 2}
            <p class="py-2 text-center">Nenhum valor encontrado</p>
        {/if}
    </ul>
</div>
