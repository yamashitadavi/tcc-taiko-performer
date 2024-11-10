<script lang="ts">
	import Trash from './../icons/trash.svelte';
	import Toast from './toast.svelte';
	import ModalError from './modalError.svelte';
    import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getUrlParams, showToast } from '../../functions/utils';
	import { ToastType } from '../enums/Enums';
    
    let routes = [
        { route: '/', label: 'Home', svg: { cmp: Trash, class: "" }},
        { route: '/tocador', label: 'Tocador', svg: { cmp: Trash, class: "" }},
        { route: '/musica', label: 'Música', svg: { cmp: Trash, class: "" }},
        { route: '/apresentacao', label: 'Apresentação', svg: { cmp: Trash, class: "" }}
    ];
    let darkMode = window.localStorage.getItem('theme') == 'true';
    
    document.documentElement.setAttribute('data-theme', darkMode ? 'dim' : 'nord')
    function changeToggle(e : any) {
       document.documentElement.setAttribute('data-theme', e.target.checked ? 'dim' : 'nord')
       window.localStorage.setItem('theme', e.target.checked+'')
    }
    export let className : string = ''

    onMount(() => {
        const { recordDeleted } = getUrlParams()
        if (recordDeleted) showToast('Registro deletado', '', ToastType.success)
    })

</script>
<ModalError />
<div class="h-screen w-screen max-w-full max-h-full flex flex-col ">

    <Toast/>
    <header>
        <ul class="menu menu-horizontal bg-base-200 w-full p-0 items-center" data-sveltekit-preload-data="false">
            {#each routes as { route, label, svg } (route)}
            <li>
                <a href={route} class:active={$page.url.pathname.split('/')[1] == route.split('/')[1]}>
                    <svelte:component this={svg.cmp} className={svg.class}></svelte:component>
                {label}
                </a>
            </li>
            {/each}
            <li>
                <input type="checkbox" class="toggle toggle-primary" checked={darkMode} on:change={changeToggle}/>
            </li>
        </ul>
    </header>
    <div class="w-full h-full max-h-full max-w-full 
    md:p-4 
    overflow-auto {className}">
        <slot/>
    </div>
</div>
