<script lang="ts">
	import type { SupabaseClient, User } from "@supabase/supabase-js";
    import { onMount } from "svelte";

    type Props ={
        supabase:SupabaseClient,
        user:User|null
    }

    const { user,supabase }:Props = $props()

    const deleteChat = async(id:string)=>{
        await supabase.from("chats").delete().eq("id",id)
    }

    let chat = $state<Chat[]>([])

    const fetchChat = async()=>{
        const { data:chats } = await supabase.from("chats").select(`
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

    onMount(()=>{
        const channel = supabase
        .channel("chats")
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, async(payload) => {
            fetchChat()
        })
        .subscribe()

        fetchChat()

        return()=>{
            supabase.removeChannel(channel)
        }
    })
</script>

{#each chat as cht,i}
    {#key i}
        {#if cht.user.email == user?.email}
        <div class="flex flex-col items-end self-end" aria-label="Message from you">
            <span class="text-xs text-gray-500 mb-1" aria-hidden="true">From you</span>
            <div class="bg-green-200 rounded-tl-lg rounded-tr-lg rounded-bl-lg p-3 max-w-sm text-sm shadow">
                <p>{cht.message}</p>
            </div>
            <button 
                onclick={() => deleteChat(cht.id)} 
                class="text-red-500 font-[100]" 
                aria-label="Delete your message">
                Delete
            </button>
        </div>
        {:else}
        <div class="flex flex-col items-start self-start" aria-label="Message from {cht.user.name}">
            <span class="text-xs text-gray-500 mb-1" aria-hidden="true">From {cht.user.name}</span>
            <div class="bg-white rounded-tl-lg rounded-tr-lg rounded-br-lg p-3 max-w-sm text-sm shadow">
                <p>{cht.message}</p>
            </div>
        </div>
        {/if}
    {/key}
{/each}