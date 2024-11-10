<script lang="ts">
    
	import { createEventDispatcher } from 'svelte';
	import { formatDate, formatDateTime } from '../../functions/utils';
    class Column {
		label : string = ''
		value : string = ''
		type? : string
		attrClass? : string
		urlLabel? : string
		svg? : any

		constructor(obj : Partial<Column>) {
			Object.assign(this, obj)
		}
	}
	
	const dispatcher = createEventDispatcher()

    export let columns : Array<Column> = []; 
    export let rows : Array<{[key : string]: any}> = [];
    export let key : string;
	export let className : string = '';

    function rowAction(action : string, key : any, index : number) {
        dispatcher('rowaction', { action, key, index})
    }
</script>

<div class="overflow-auto {className}">
	<table class="table">
		<thead>
			<tr>
				<th>
				</th> 
				{#each columns as { label, value } (value)}
				<th data-value={value}>
					{label}
				</th>
				{/each}
			</tr>
		</thead>
		<!-- body -->
		<tbody>
		{#each rows as row, i (row[key])}
			<tr>
				<th>
					{i+1}
				</th>
				
				{#each columns as { value, type, attrClass = '', urlLabel = '', svg } (value)}
					{#if type == 'button'}
					<th>
						<button class="btn {attrClass ? attrClass : 'btn-ghost btn-xs'}" on:click={() => rowAction(value, row[key], i)}>
							{#if svg}
								<svelte:component this={svg.cmp} value={value} name={row[value]} className={svg.class}></svelte:component>
							{/if}
							{row[value] || ''}
						</button>
					</th>
					{:else if type == 'checkbox'}
					<th>
						<label>
						<input type="checkbox" class="checkbox {attrClass ? attrClass : 'checkbox-sm checkbox-primary'}" bind:checked={row[value]} disabled>
						</label>
					</th>
					{:else if type == 'link'}
					<td >
						<a class="link {attrClass ? attrClass : 'link-primary'}" href={row[value]}>{row[urlLabel]}</a>
					</td>
					{:else if type == 'datetime'}
					<td>
						{formatDateTime(row[value])}
					</td>
					{:else if type == 'date'}
					<td>
						{formatDate(row[value])}
					</td>
					{:else}
					<td>{row[value]}</td>
					{/if}
				
				{/each}
			</tr>
		{/each}
		</tbody>

	</table>
</div>