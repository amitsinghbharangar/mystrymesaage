'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import {useState } from "react"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


export default function page() {
  const { toast } = useToast()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
 
  const router = useRouter()

  // zod implementation 
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      username:'',
      password:'',
    }
  })


  const onSubmit = async (data:z.infer<typeof signInSchema>) =>{
    setIsSubmitting(true)
    const result = await signIn('credentials',{
      redirect:false,
      identifier:data.username,
      password:data.password
    })
    if(result?.error){
      setIsSubmitting(false)
      toast({
        title:"Login failed",
        description:result.error,
        variant:"destructive"
      })
    }
    if(result?.url){
      router.replace('/dashboard')
    }
  }
  return (
    <div className="  md:flex  md:bg-blue-200">
      <div className="flex-1 items-center justify-center align-middle">
    <Image 
  src="illustration.svg" 
  alt="Description of the image" 
  width={500} 
  height={300} 
  className="bg-blue-200 hidden md:flex self-center  "
/>
   </div>
        <div className="flex-1 justify-center md:p-4 min-h-screen ">
    <div className=" sm:max-w-2xl  md:max-w-6xl p-8 space-y-6 bg-white rounded-lg md:shadow-md">
      <div className="text-center">
        <h1 className="text-3xl text-blue-700 font-extrabold tracking-tight lg:text-4xl mb-6">
          Welcome to Mystry Message
        </h1>
        <p className="mb-4">
          Login to start your anonymous adventure.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} 
               />
              </FormControl>
              
              <FormMessage />
            </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-800">
            {
              isSubmitting? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : ('SignIn')
            }
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4 ">
        <p>
          Don't have account ?{' '}
          <Link href='/sign-up' className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
   </div>
    </div>
   
  )
}