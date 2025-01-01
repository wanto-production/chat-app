<script lang="ts">
    import { enhance } from '$app/forms';
    import * as Tabs from './ui/tabs';
    import { Button } from './ui/button';
    import { Input } from './ui/input';
    import * as Card from './ui/card';
	import type { ActionData } from '../../routes/$types';

    type Props = {
        form:ActionData
        user2:any
    }

    let { form,user2 }:Props = $props()
</script>

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
            <input type="hidden" name="email" value={user2.email}>
            <Input class=" placeholder:text-black" type="text" name="username" placeholder="ganti nama"/>
            <Button type="submit">edit</Button>
        </form>
    </Tabs.Content>
    <Tabs.Content class=" w-full h-[130px]" value="main">
        <Card.Root>
            <Card.Header>
                <h2>message: {form?.message || ""}</h2>
            </Card.Header>
            <Card.Content>
                <form class=" flex gap-2 items-center " action="?/chat" method="post" use:enhance>
                    <Input type="text" name="message" class=" placeholder:text-black" placeholder={`send message as ${user2.name}`} required/>
                    <Button type="submit" >send</Button>
                </form>
            </Card.Content>
        </Card.Root>
    </Tabs.Content>
</Tabs.Root>