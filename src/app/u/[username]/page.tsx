'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z  from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { messageSchema } from '@/schemas/messageSchema';
import { Message, Reply } from '@/model/User';
export default function VerifyAccount (){
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const username = params.username;
  const [content,setcontent] = useState('');
  const [messages,setMessages] = useState("What's a skill you'd love to learn, and why?||If you could travel anywhere in the world right now, where would you go and what would you do?||What's a book, movie, or song that has recently impacted you, and how?")
  const [suggestMessage1,setSuggestMessage1] = useState('');
  const [suggestMessage2,setSuggestMessage2] = useState('');
  const [suggestMessage3,setSuggestMessage3] = useState('');

  const {toast} = useToast()
  
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver:zodResolver(messageSchema),   
  })
  const suggestMessage = async() => {
    try {
      // const response = await axios.post<ApiResponse>('/api/suggestMessages');
      // setSuggestMessage1(response.data.message)
      const sentences = messages.split('||').map((s) => s.trim());
      let currentSentenceIndex = 0;
      let currentCharIndex = 0;

    // Simulate streaming-like output
      const interval = setInterval(() => {
      if (currentSentenceIndex < sentences.length) {
        const currentSentence = sentences[currentSentenceIndex];

        if (currentCharIndex < currentSentence.length) {
          // Update the corresponding sentence field character by character
          if (currentSentenceIndex === 0) {
            setSuggestMessage1((prev) => prev + currentSentence[currentCharIndex]);
          } else if (currentSentenceIndex === 1) {
            setSuggestMessage2((prev) => prev + currentSentence[currentCharIndex]);
          } else if (currentSentenceIndex === 2) {
            setSuggestMessage3((prev) => prev + currentSentence[currentCharIndex]);
          }
          currentCharIndex++;
        } else {
          // Move to the next sentence
          currentSentenceIndex++;
          currentCharIndex = 0;
        }
      } else {
        clearInterval(interval); // Stop interval when all sentences are processed
      }
    }, 10); // Adjust the speed (e.g., 50ms per character)

    return () => clearInterval(interval)// Adjust delay as needed (e.g., 1000ms = 1 second)

    return () => clearInterval(interval);
    } catch (error) {
      console.log(error)
    }
    
  }
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
        description:""
      })
      
      setIsSubmitting(false);
      setcontent('')
      form.reset(); 
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
  <> 
    <div className='sm:max-w-2xl  md:max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-lg mx-auto'>
         <h1 className="text-lg font-semibold text-gray-800">
           Send Anonymous Message to <span className="text-blue-500">@{username}</span>
         </h1>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Input placeholder="Enter message here " 
                {...field}  />
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
              ) : ('Send')
            }
          </Button>
        </form>
      </Form>
    </div>
        <div className="w-full max-w-2xl md:max-w-6xl  bg-white rounded-lg  max-h-fit mt-8 mx-auto px-8">
         <Button className="bg-blue-500 hover:bg-blue-800 text-center" onClick={suggestMessage}>Suggest Messages</Button>
         <div className="p-6 shadow-md mt-3">
             <h1 className="text-lg font-bold">Messages</h1>
             <Input
                className="my-4 cursor-pointer hover:bg-blue-50"
                value={suggestMessage1}
                readOnly
                onClick={() => {
                  setcontent(suggestMessage1);
                  form.setValue("content", suggestMessage1);
                }}
              />

              <Input
                className="my-4 cursor-pointer hover:bg-blue-50"
                value={suggestMessage2}
                readOnly
                onClick={() => {
                  setcontent(suggestMessage2);
                  form.setValue("content", suggestMessage2);
                }}
              />

              <Input
               className="my-4 cursor-pointer hover:bg-blue-50"
                value={suggestMessage3}
                readOnly
                onClick={() => {
                  setcontent(suggestMessage3);
                  form.setValue("content", suggestMessage3);
                }}
              />
             
         </div>
        
       </div>
       <div className="text-center my-6 text-lg font-semibold">Get Your Message Board</div>
       <div className="flex justify-center mb-8"><Button>Create your Account</Button></div>
     </>
  )
}
