<script lang="ts">
	import { createEventDispatcher } from "svelte";

    
    export let label = ''
    export let id = ''
    export let name = ''
    export let type : string = 'text'
    export let placeholder = ''
    export let value = ''
    export let file : any = ''
    export let checked = false
    export let disabled = false
    export let required = false
    export let bordered = true
    export let inputClass = ''
    export let url = ''
    export let size = 'md' 
    export let accept = ''

    const typeClass : any  = {
        file: `file-input ${bordered ? 'file-input-bordered' : ''}`
    }

    const typeMap : any = {
        file: 'file-input',
        text: 'input',
        number: 'pr-0 input'
    }

    const dispatcher = createEventDispatcher();
    $: inputSize = `${typeMap[type] ?? type}-${size}`

    function onInput(e : any) {
        console.log(e)
        value = e.target.value
        checked = e.target.checked
        file = (e.target.files || []) //[0]  || ''
        dispatcher('input', e)
    }

    //registrar label
    if (url) {
        dispatchEvent(new CustomEvent('translate', {detail : {urlForm: url, name, label}}))
    }


    //formLabel deve ser aqui
</script>

<label class="form-control w-full h-auto" title={label}>
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
    {#if type == 'checkbox'}
        <input class="checkbox m-auto {inputSize} {inputClass}" {id} {name} {type} {placeholder} {checked} {disabled} {required} on:input={onInput} on:change on:blur/>
    {:else}
        <input class="{typeClass[type] || `input ${bordered ? 'input-bordered' : ''}`} w-full {inputSize} {inputClass}" {id} {name} {type} {placeholder} {value} {disabled} {required} {accept} on:input={onInput} on:change on:blur/>
    {/if}
</label>