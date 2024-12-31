import { prisma } from '$lib/prisma.js'
import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'

export const GET = async ({ locals,url }) => {
    const { token_hash,type } = Object.fromEntries(url.searchParams) as {
        token_hash:string,
        type:EmailOtpType
    }

    const { error,data } = await locals.supabase.auth.verifyOtp({
        token_hash,
        type
    })

    if(error) console.log(error)
    
    const existing_user = await prisma.user.findUnique({
        where:{
            email:data.user?.email
        }
    })
    
    if(!existing_user){
        await prisma.user.create({
            data:{
                email:data.user?.email as string,
                id:data.user?.id as string
            }
        })
    }

    return redirect(302,'/')
}