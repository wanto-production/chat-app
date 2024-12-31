import { prisma } from "$lib/prisma"


export const load = async ({ locals }) => {
    const { user } = locals

    if(user){
        const user2 = await prisma.user.findUnique({
            where:{
                email:user.email
            }
        })

        return{
            user,
            user2
        }
    }

    return{ 
        user
    }
}

export const actions ={
    login:async ({ request,locals }) => {
        const formdata = await request.formData()
        const { email } = Object.fromEntries(formdata) as {
            email:string,
        }

        const { error } = await locals.supabase.auth.signInWithOtp({
            email
        })

        if(error) return{ message:error.message }

        return{ message:"login berhasil, tunggu email verifikasi "}
    },
    chat:async ({ request,locals }) => {
        const message = (await request.formData()).get("message") as string

        try {
            await prisma.chat.create({
                data:{
                    message,
                    user:{
                        connect:{
                            email:locals.user?.email as string
                        }
                    }
                }
            })
    
            return{ message:"chat berhasil" }
        } catch (error) {
            console.log(error)
            return{ message:"gagal chat" }
        }
    },
    username:async ({ request,locals }) => {
        const name = (await request.formData()).get("username") as string

        await prisma.user.update({
            where:{
                email:locals.user?.email as string
            },
            data:{
                name
            }
        })

        return{ message:"berhasil input nama!" }
    }
}