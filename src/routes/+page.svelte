<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
    import autoAnimate from '@formkit/auto-animate';
	import Containerchat from '$lib/components/Containerchat.svelte';
	import Tabsform from '$lib/components/Tabsform.svelte';

    
    const { data,form } = $props()


</script>

<main class=" w-full h-screen flex flex-col justify-center items-center gap-3 bg-gray-400">
    <div class=" w-[300px] min-h-[200px] h-fit bg-white rounded-md flex flex-col justify-center items-center gap-3 p-2">
        {#if !data.user}
            {#if form?.message}
            <h2>{form?.message}</h2>
            {/if}
        <form class=" flex gap-2 items-center " action="?/login" method="post" use:enhance>
            <Input type="email" name="email" class=" placeholder:text-black" placeholder="you email" required/>
            <Button type="submit">login</Button>
        </form>
        {:else if !data.user2?.name}
            {#if form?.message}
                <h2>{form?.message}</h2>
            {/if}
        <form class=" flex gap-2 items-center flex-wrap " action="?/username" method="post" use:enhance>
            <Input type="text" name="username" class=" placeholder:text-black" placeholder="you username" required/>
            <Button type="submit">enter</Button>
        </form>
        {:else}
            <Tabsform user2={data.user2} {form}/>
        {/if}
    </div>
    <div class=" w-[300px] bg-white rounded-md h-[320px] relative overflow-x-hidden">
        <h1 class=" sticky top-0 w-full text-center bg-[#0c0c0c] text-white p-2 z-20">chat global</h1>
        <div class=" flex flex-col-reverse gap-2 justify-center items-center p-3 gap3 h-fit w-full" use:autoAnimate>
            <Containerchat supabase={data.supabase} user={data.user} />
        </div>
    </div>
</main>