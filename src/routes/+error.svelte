<script lang="ts">
    import { page } from '$app/stores';
    import "../app.css"
</script>
{#if $page.status !== 404}
<h1>{$page.status}: {$page.error?.message}</h1>
{:else}
    <div class="bg-white w-screen h-screen content-center justify-center flex ">
        <img src="https://s2.booth.pm/5d43a409-e2fe-43ae-960a-7f8ae22ab48b/i/5683557/6183ebe6-be78-4c09-aa3e-2d00c280656f_base_resized.jpg" alt="404">
    </div>
{/if}