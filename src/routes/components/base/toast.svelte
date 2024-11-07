	<script lang="ts">
		import { onDestroy } from "svelte"; 
		import type { ToastType } from "../enums/Enums";

    class ToastDetail {
		title? : string
		text? : string
		type? : ToastType
        constructor(title? : string , text? : string, type? : ToastType) {
			this.title = title
			this.text = text
			this.type = type
        }
    }

    
    let dt : Array<ToastDetail> = [];
	let timeouts : Array<number> = [];

    const eventHandler = (event : any) => {
		dt = [...dt, event.detail]
		timeouts = [...timeouts, setTimeout(()=>{
			dt.shift()
			dt = [...dt]
			timeouts.shift()
			timeouts = [...timeouts]
		}, 5000)]
    };		

    window.addEventListener('toast', eventHandler);  

    onDestroy(() => {
        window.removeEventListener('toast', eventHandler);
    });

    function onClose(i : number) {
		clearTimeout(timeouts.splice(i, 1)[0])
		timeouts = [...timeouts]
		dt.splice(i,1)
		dt = [...dt]
    }

    
</script>

<div class="toast toast-end max-h-[50%] z-10">
	{#each dt as { title = '', text = '', type = 'alert-info' }, i (i) }

		<div class="alert {type} sm:gap-2 gap-0" >
			<div class="flex flex-col mr-auto text-left truncate">
				<div class="text-lg font-bold">{title}</div>
				<div>{text}</div>	
			</div>	
			<button class="btn btn-circle btn-sm sm:ml-auto my-auto bg-transparent border-none hover:bg-opacity-50" on:click={()=>{
				onClose(i)
			}}>
				<svg class="h-4 w-4 stroke-black" viewBox="0 0 24 24" ><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
			</button>
		</div>
		
	{/each}
</div>