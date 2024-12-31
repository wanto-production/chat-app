<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';
    import * as Card from '$lib/components/ui/card';
    import autoAnimate from '@formkit/auto-animate';

    
    const { data,form } = $props()

    let chat = $state<Chat[]>([])

    const fetchChat = async()=>{
        const { data:chats } = await data.supabase.from("chats").select(`
            id,
            message,
            user:users (
                id,
                name,
                email
            )
        `)

        //@ts-ignore
        chat = chats as Chat[]
    }

    const deleteChat = async(id:string)=>{
        const { error } = await data.supabase.from("chats").delete().eq("id",id)
    }

    onMount(()=>{
        const channel = data.supabase
        .channel("chats")
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, async(payload) => {
            fetchChat()
        })
        .subscribe()

        fetchChat()

        return()=>{
            data.supabase.removeChannel(channel)
        }
    })

</script>

<main class=" w-full h-screen flex flex-col justify-center items-center gap-3 bg-gray-400">
    <div class=" w-[300px] h-[200px] bg-white rounded-md flex flex-col justify-center items-center gap-3 p-2">
        {#if form?.message}
            <h2>{form?.message}</h2>
        {/if}
        {#if !data.user}
        <form class=" flex gap-2 items-center " action="?/login" method="post" use:enhance>
            <Input type="email" name="email" class=" placeholder:text-black" placeholder="you email" required/>
            <Button type="submit">login</Button>
        </form>
        {:else if !data.user2?.name}
        <form class=" flex gap-2 items-center flex-wrap " action="?/username" method="post" use:enhance>
            <Input type="text" name="username" class=" placeholder:text-black" placeholder="you username" required/>
            <Button type="submit">enter</Button>
        </form>
        {:else}
            <form action="?/signout" method="post" use:enhance>
                <Button type="submit">logOut</Button>
            </form>
            <form class=" flex gap-2 items-center " action="?/chat" method="post" use:enhance>
                <Input type="text" name="message" class=" placeholder:text-black" placeholder={`send message as ${data.user2?.name}`} required/>
                <Button type="submit">send</Button>
            </form>
        {/if}
    </div>
    <div class=" w-[300px] bg-white rounded-md h-[320px] relative overflow-x-hidden">
        <h1 class=" sticky top-0 w-full text-center bg-[#0c0c0c] text-white p-2 z-20">chat global</h1>
        <div class=" flex flex-col-reverse gap-2 justify-center items-center p-3 gap3 h-fit w-full" use:autoAnimate>
            {#if chat}
                {#each chat as cht}
                    <Card.Root class={` ${cht.user.name == data.user2?.name?'bg-green-200 self-start':'bg-white self-end border-2 border-gray-500 text-end'}  w-[200px] `}>
                        <Card.Content>
                            <p class=" text-sm">from 
                                {#if cht.user.name == data.user2?.name}
                                    <span>you</span>
                                {:else}
                                    <span>{cht.user.name}</span>
                                {/if}
                            </p>
                            <h2 class=" font-bold text-2xl">{cht.message}</h2>
                        </Card.Content>
                        {#if cht.user.email == data.user?.email}
                            <Card.Footer>
                                <Button onclick={()=> deleteChat(cht.id)} class=" bg-red-600 hover:bg-red-400">delete</Button>  
                            </Card.Footer>
                        {/if}
                    </Card.Root>
                {/each}
            {/if}
        </div>
    </div>
</main>