'use client'
import { messageSchema } from "@/schemas/messageSchema"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from 'date-fns';
import { Button } from "./ui/button"
import { Loader2, X} from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"

import { Input } from "./ui/input"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

type MessageCardProps = {
  message:Message;
  onMessageDelete:(messageId:string) => void
  

}
const MessageCard = ({message, onMessageDelete}:MessageCardProps) => {

  const {toast} = useToast();
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(`/api/deleteMessage/${message._id}`)
    toast({
      title: response.data.message
    })
    onMessageDelete(message.id)
  }
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reply,setReply] = useState('')
  const [time,setTime] = useState('hello')
  const router = useRouter();
  console.log(message)
  
  const submit = async ()=>{
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/reply',{content:reply,message:message.content})
      toast({
        title:response.data.message,
        description:"You can see it on you reply page."
      })
      handleDeleteConfirm()
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in replying.", error)
      const axiosError =error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title:"Failed to send the message.",
        description:errorMessage,
        variant:"destructive"
      })
      setIsSubmitting(false);
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReply(e.target.value);
  };
  
  return (
    <Card>
        <CardHeader className="flex flex-row justify-between items-center  p-2">
          <div className="pl-5"><small>{formatDistanceToNow(new Date(message.createAt), { addSuffix: true })}</small></div>
            <AlertDialog >
                <AlertDialogTrigger asChild className="">
                  <Button variant={"destructive"} ><X className="w-5 h-20" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your message.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </CardHeader>
        <CardContent>
           <CardDescription className="text-base font-normal text-black">{message.content}</CardDescription>
        </CardContent>
        <CardFooter className="flex  gap-5">
          {/* here declare the reply  */}
            <Input placeholder="Reply"
            value={reply}
            onChange={handleChange} 
            />
            <Button disabled={!reply.trim() || isSubmitting } onClick={submit} >Send</Button>
            
        </CardFooter>
    </Card>
  )
}

export default MessageCard
