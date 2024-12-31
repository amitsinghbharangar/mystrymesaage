'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z  from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
export default function VerifyAccount (){
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const username = params.username;

  const {toast} = useToast()
  
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver:zodResolver(verifySchema),   
  })

  const onSubmit = async (data:z.infer<typeof verifySchema>) =>{
    if(params){
      console.log(username)
    }else{
      console.log("userName is not found ")
      return
    }
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/verifyCode', {username,code:data.code});
      toast({
        title:response.data.message,
        description:"You will be redirected to login page."
      })
      router.replace(`/sign-in`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in verifying", error)
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
    <div className='flex justify-center items-center min-h-screen p-4 bg-gray-100'>
        <div className='sm:max-w-2xl  md:max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-lg'>
            <div className='text-center'>
                <h1 className='text-3xl font-extrabold tracking-tight lg:text-4xl mb-4'>
                    Verify your Account
                </h1>
                <p className='mb-4'>
                    Enter the verification code send to your email
                </p>
            </div>
            <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
            <FormItem>
              <FormLabel>code</FormLabel>
              <FormControl>
                <Input placeholder="Enter code " {...field} />
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
              ) : ('Verify')
            }
          </Button>
        </form>
      </Form>
        </div>
    </div>
  )
}


