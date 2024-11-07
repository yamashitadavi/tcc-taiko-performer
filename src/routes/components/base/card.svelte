<script lang="ts">
    export let title = '';
    export let className = '';
</script>
<style>
    
  .card-body-no-padding .card-body { 
    @apply p-0
	}
	.card-no-frame {
		@apply border-none shadow-none rounded-none
	}
  .card-no-frame > div > div {
    @apply p-0 pb-4
  }

  .card-no-actions .card-actions {
    @apply hidden !important
  }

  
</style>
<div class="card card-compact shadow-xl border border-base-300 overflow-auto card-body-no-padding {className}">
    <div class="card-body overflow-auto">
      <div class="card-actions justify-end items-center p-4">
        {#if title}<h2 class="card-title mr-auto truncate">{title}</h2>{/if}
        <slot name="actions"/>
      </div>
      <slot />
    </div>  
</div>