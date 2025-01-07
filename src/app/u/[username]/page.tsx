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
import { messageSchema } from '@/schemas/messageSchema';
export default function VerifyAccount (){
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const username = params.username;

  const {toast} = useToast()
  
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver:zodResolver(messageSchema),   
  })

  const onSubmit = async (data:z.infer<typeof messageSchema>) =>{
    if(params){
      console.log(username)
    }else{
      console.log("userName is not found ")
      return
    }
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sendMessage', {username,content:data.content});
      toast({
        title:response.data.message,
        description:"You will be redirected to login page."
      })
      
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in verifying", error)
      const axiosError =error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"failed",
        description:errorMessage,
        variant:"destructive"
      })
      setIsSubmitting(false);
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen p-4 bg-gray-100'>
        <div className='sm:max-w-2xl  md:max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-lg'>
            
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
          <FormField
            control={form.control}
            name="content"
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









// 'use client'
// import { Button } from "@/components/ui/button";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import { messageSchema} from "@/schemas/messageSchema";
// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { AxiosError } from "axios";
// import { useParams } from "next/navigation";
// import { useState } from "react";
// import { Form, useForm } from "react-hook-form";

// import * as z  from "zod"
// export default function Home() {
//     const params = useParams();
//     const username = params.username;
//     const { toast } = useToast()
//     const [content,setcontent] = useState('');
//     const [suggestMessage1,setSuggestMessage1] = useState('');
//     const [suggestMessage2,setSuggestMessage2] = useState('2');
//     const [suggestMessage3,setSuggestMessage3] = useState('3');
//     const [isSending,setIsSending] = useState(false)

//     const form = useForm<z.infer<typeof messageSchema>>({
//       resolver: zodResolver(messageSchema),
//       defaultValues: {
//         content: '', // Default value for `content`
//       },
//     });
//     const onSubmit = async (data:z.infer<typeof messageSchema>) =>{
//     if(params){
//       console.log(username)
//     }else{
//       console.log("userName is not found ")
//       return
//     }
   
//     try {
//       const response = await axios.post<ApiResponse>('/api/sendMessage', {username,content:data.content});
//       toast({
//         title:response.data.message,
//         description:"You will be redirected to login page."
//       })
      
//     } catch (error) {
//       console.error("Error in verifying", error)
//       const axiosError =error as AxiosError<ApiResponse>;
//       let errorMessage = axiosError.response?.data.message;
//       toast({
//         title:"Signup failed",
//         description:errorMessage,
//         variant:"destructive"
//       })
      
//     }
//   }
//   return (
//     <>
//       <div className="w-full max-w-2xl md:max-w-6xl p-4 bg-white rounded-lg shadow-md max-h-fit mt-6 mx-auto">
//         <h1 className="text-lg font-semibold text-gray-800">
//           Send Anonymous Message to <span className="text-blue-500">@hc</span>
//         </h1>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                     <FormField
//                         control={form.control}
//                         name="content"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>content</FormLabel>
//                                 <FormControl>
//                                     <Input
//                                         {...field}  // Registering with react-hook-form
//                                         className="my-4"
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                     <Button type="submit">Send</Button>
//                 </form>
        
//       </div>
//       <div className="w-full max-w-2xl md:max-w-6xl  bg-white rounded-lg  max-h-fit mt-8 mx-auto">
//         <Button className="bg-blue-500 hover:bg-blue-800 text-center">Suggest Messages</Button>
//         <div className="p-6 shadow-md mt-3">
//             <h1 className="text-lg font-bold">Messages</h1>
//             <Input className="my-4"
//                 value={suggestMessage1}
//             />
//             <Button >Click</Button>
//             <Input className="my-4"
//                 value={suggestMessage2}
//             />
//             <Button>Click</Button>
//             <Input className="my-4"
//                 value={suggestMessage3}
//             />
//             <Button>Click</Button>
//         </div>
        
//       </div>
//       <div className="text-center my-6 text-lg font-semibold">Get Your Message Board</div>
//       <div className="flex justify-center mb-8"><Button>Create your Account</Button></div>
//     </>
//   );
// }
