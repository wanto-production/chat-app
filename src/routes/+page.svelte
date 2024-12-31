<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';
    import * as Card from '$lib/components/ui/card';
    import autoAnimate from '@formkit/auto-animate';
    import * as Tabs from '$lib/components/ui/tabs'

    
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
        <Tabs.Root value="main" class="w-full h-full">
            <Tabs.List class="grid w-full grid-cols-2">
                <Tabs.Trigger value="main">main</Tabs.Trigger>
                <Tabs.Trigger value="account">Account</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content class=" h-[130px] relative" value="account">
                <form action="?/signout" class=" absolute top-0 left-0" method="post" use:enhance>
                    <Button type="submit" size="sm">logOut</Button>
                </form>
                <form method="POST" action="?/changename" class=" flex w-full h-[200px] justify-center items-center gap-2">
                    <input type="hidden" name="email" value={data.user2.email}>
                    <Input class=" placeholder:text-black" type="text" name="username" placeholder="ganti nama"/>
                    <Button type="submit">edit</Button>
                </form>
                {#if form?.message}
                    <h2>{form?.message}</h2>
                {/if}
            </Tabs.Content>
            <Tabs.Content class=" w-full h-[130px]" value="main">
                <Card.Root>
                    {#if form?.message}
                    <Card.Header>
                        <h2>{form?.message}</h2>
                    </Card.Header>
                    {/if}
                    <Card.Content>
                        <form class=" flex gap-2 items-center " action="?/chat" method="post" use:enhance>
                            <Input type="text" name="message" class=" placeholder:text-black" placeholder={`send message as ${data.user2.name}`} required/>
                            <Button type="submit">send</Button>
                        </form>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>
        </Tabs.Root>
        {/if}
    </div>
    <div class=" w-[300px] bg-white rounded-md h-[320px] relative overflow-x-hidden">
        <h1 class=" sticky top-0 w-full text-center bg-[#0c0c0c] text-white p-2 z-20">chat global</h1>
        <div class=" flex flex-col-reverse gap-2 justify-center items-center p-3 gap3 h-fit w-full" use:autoAnimate>
            {#if chat}
                {#each chat as cht}
                    {#if cht.user.email == data.user?.email}
                        <div class="flex flex-col items-end self-end">
                            <span class="text-xs text-gray-500 mb-1">from you</span>
                            <div class="bg-green-200 rounded-tl-lg rounded-tr-lg rounded-bl-lg p-3 max-w-sm text-sm shadow">
                                <p>{cht.message}</p>
                                <form class=" w-full flex justify-start mt-2">
                                    <button onclick={() =>deleteChat(cht.id)} class="text-red-500 font-[100]">delete</button>
                                </form>
                            </div>
                        </div>
                    {:else}
                        <div class="flex flex-col items-start self-start">
                            <span class="text-xs text-gray-500 mb-1">from {cht.user.name}</span>
                            <div class="bg-white rounded-tl-lg rounded-tr-lg rounded-br-lg p-3 max-w-sm text-sm shadow">
                                <p>{cht.message}</p>
                            </div>
                        </div>
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
</main>