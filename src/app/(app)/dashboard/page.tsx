'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message, User } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"

import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const page = () => {
    const {data : session} = useSession();
    const user:User = session?.user as User;
    const [messages,setMessages] = useState<Message[]>([])
    const [isLoading,setIsLoading] = useState(false)
    const [isSwitchLoading,setIsSwitchLoading] = useState(false)
    const {toast} = useToast();
    
    const handleDeleteMessage = (messageId:string)=>{
        console.log("message refresh chl gya")
        setMessages(messages.filter((message)=>message._id !== messageId))
    }

    const form = useForm({
        resolver:zodResolver(acceptMessageSchema)
    })

    const {register,watch,setValue} = form;

    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessages = useCallback(async()=>{
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/acceptMessage')
            setValue('acceptMessages',response.data.isAcceptingMessage);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "Failed to fetch message setting",
                variant:"destructive"
            })
        } finally{
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    },[setValue])

    const fetchMessages = useCallback(async(refresh:boolean = false)=>{
        setIsLoading(true);
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/getMessages');
            setMessages(response.data.messages || [])
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
            setIsSwitchLoading(false)
        }
    },[setIsLoading, setMessages])

    useEffect(()=>{
        if(!session || !session.user) return
        fetchMessages();
        fetchAcceptMessages()
    },[session,setValue, fetchAcceptMessages,fetchMessages])

    const handleSwitchChange = async()=>{
        try {
            const response = await axios.post<ApiResponse>('/api/acceptMessage',{
                acceptMessages:!acceptMessages
            })
            setValue('acceptMessages',!acceptMessages)
            toast({
                title:response.data.message,
                variant:'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "Failed to fetch message setting",
                variant:"destructive"
            })
        }
    }
    
    
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${user?.username }`

    const copyToClipboard = () =>{
        navigator.clipboard.writeText(profileUrl)
        toast({
            title:"URL copied",
            description:"Profile URL has been copied to clipboard"
        })
    }

    return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
        <div className="mb-4 ">
            <h2 className="text-lg font-semibold mb-2">Copy your Unique Link & share with friends</h2>{' '}
            <div className="flex items-center">
                <input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="input input-bordered w-full p-2 mr-2"
                    aria-label="Profile URL"
                />
                <Button variant='outline' color="blue" onClick={copyToClipboard}>Copy</Button>
            </div>
        </div>
        
        <div className="mb-4">
            <Switch
                {...register('acceptance')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
            />
            <span className="ml-2">
                Accept Messages:{acceptMessages ? 'On' : 'Off'}
            </span>
        </div>
        <Separator />
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
  );
}

export default page
