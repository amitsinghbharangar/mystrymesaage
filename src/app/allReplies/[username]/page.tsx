'use client'
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Reply, User } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useCallback, useState } from 'react'

const page = () => {
  
    const [messages,setMessages] = useState<Reply[]>([])
    const [isLoading,setIsLoading] = useState(false)
    
    const {toast} = useToast();
  const params = useParams();
  const username = params.username;
  const fetchMessages = useCallback(async(refresh:boolean = false)=>{
        setIsLoading(true);
        
        try {
            const response = await axios.get<ApiResponse>('/api/getReplies');
            
            if(refresh){
                toast({
                    title:"Refreshed",
                    description: "Showing latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "Failed to fetch message setting",
                variant:"destructive"
            })
        } finally{
            setIsLoading(false)
        }
    },[setIsLoading, setMessages])
  return (
    <>
    <div className='sm:max-w-2xl  md:max-w-6xl p-6 space-y-6 bg-white rounded-lg shadow-lg mx-auto'>
      <h1 className="text-lg font-semibold text-gray-800">
        Replies made by <span className="text-blue-500">@{username}</span>
      </h1>
    </div>
        <div className='sm:max-w-2xl  md:max-w-6xl p-6 space-y-6 bg-white rounded-lg shadow-lg mx-auto'>
    <Button 
            className="mt-4"
            variant='outline'
            onClick={(e)=>{
                e.preventDefault();
                fetchMessages(true)
            }}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <RefreshCcw className="h-4 w-4" />
            )}
        </Button>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
                messages.map((message,index,)=>(
                    <MessageCard
                        key={String(message._id)} // React handles this internally
                        message={message} // Pass `message` explicitly
                        onMessageDelete={handleDeleteMessage}
                        
                    />
                ))
            ) : (
                <p>No message to display.</p>
            )}
        </div>
        </div>
    </>
  )
}

export default page
