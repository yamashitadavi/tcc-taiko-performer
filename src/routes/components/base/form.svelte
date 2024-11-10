<script lang="ts">
	import { enhance } from '$app/forms';
	import { upsertTable } from '../../functions/request';
	import { ToastType } from '../enums/Enums';
	import { showToast } from '../../functions/utils';
	import { createEventDispatcher } from 'svelte';
	import { DBTable } from '../classes/classes';

    export let url : string
    export let formDataUrl : string = ``
    export let body : DBTable
    export let validate : Function;
    export let beforeFormData : Function|undefined = undefined;
    export let key : string = ''
    export let enctype : string = 'application/x-www-form-urlencoded'
    export let borderless : boolean = false
    export let form : any = false
    export let disableEnter : boolean = false

const dispatch = createEventDispatcher();

async function enhanceFunc({ formData, cancel, submitter } : any) {
    
    cancel()
    if (submitter && !submitter.dataset.submit) {
        return
    }

    dispatch('loading', true)
    console.log(body)
    let bodyreq : any = body

    console.log('bodyReq ',bodyreq)
    console.log(formData)
    formData.forEach((value: any, key: string | number) => {
        console.log(value)
        bodyreq[key] = value;
    });

    bodyreq = bodyreq.toDb()

    let [valid, message, newBody, hasFormData] = validate(bodyreq)

    console.log(valid,message,newBody,hasFormData)

    if (!valid) {
        showToast('Erro', message, ToastType.error);
        dispatch('loading', false)
        return
    }

    let response = await upsertTable(url, newBody, fetch, bodyreq[key])
    console.log('response', response)

    if (response.ok && hasFormData && beforeFormData) {
        let formDataBody = beforeFormData(bodyreq, response);
        console.log('formDataBody', formDataBody)
        if (formDataBody){
            const res = await upsertTable(formDataUrl, formDataBody, fetch, bodyreq[key])
            response = { ...response}
            response.ok = res.ok
            response.message = res.message
            response.body = { ...response.body, ...res.body}
            console.log('response after form data', response)
        }
    }
    dispatch('finish', response)
    
}

</script>

<form bind:this={form} class="{borderless ? '' : 'h-full'} overflow-auto flex flex-col" {enctype} method="POST" use:enhance={enhanceFunc} on:keypress={(e) => {
    if (e.key == 'Enter' && disableEnter) e.preventDefault() }}>
    <slot/>
</form>