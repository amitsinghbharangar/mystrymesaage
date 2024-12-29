'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Image from "next/image"


export default function page() {
  const { toast } = useToast()
  const [userName, setUserName] = useState('')
  const [usernameMessage, setUsernameMessage] =useState('')
  const [isCheckingUsername,setIscheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUserName,800)
  const router = useRouter()

  // zod implementation 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      userName:'',
      email:'',
      password:'',
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if(userName){
        setIscheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/checkUsernameUnique?userName=${userName}`);
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError =error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally{
          setIscheckingUsername(false)
        }
      }
    }
    checkUsernameUnique();
  },[userName])

  const onSubmit = async (data:z.infer<typeof signUpSchema>) =>{
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title:'success',
        description:response.data.message
      })
      router.push('/verify/{userName}');
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup user", error)
      const axiosError =error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"Signup failed",
        description:errorMessage,
        variant:"destructive"
      })
      setIsSubmitting(false);
    }
  }
  return (
    <div className="  md:flex  md:bg-blue-200">
        <div className="flex-1 justify-center md:p-4 min-h-screen ">
    <div className=" sm:max-w-2xl  md:max-w-6xl p-8 space-y-6 bg-white rounded-lg md:shadow-md">
      <div className="text-center">
        <h1 className="text-3xl text-blue-700 font-extrabold tracking-tight lg:text-4xl mb-6">
          Join Mystry Message
        </h1>
        <p className="mb-4">
          Sign up to start your anonymous adventure.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}/>
              </FormControl>
                {
                    isCheckingUsername && <Loader2 className="animate-spin" />
                }
                <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-blue-500' : 'text-red-500'}`}>
                    {usernameMessage}
                </p>
             
              <FormMessage />
            </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email " {...field} />
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
          <Button type="submit" disabled={isSubmitting}>
            {
              isSubmitting? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : ('Signup')
            }
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4 ">
        <p>
          Already a member?{' '}
          <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
            Sign In
          </Link>
        </p>
      </div>
    </div>
   </div>
   <div className="flex-1 items-center justify-center align-middle">
    <Image 
  src="illustration.svg" 
  alt="Description of the image" 
  width={500} 
  height={300} 
  className="bg-blue-200 hidden md:flex self-center  "
/>
   </div>
   
    </div>
   
  )
}