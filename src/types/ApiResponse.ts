import { Message } from "@/model/User";
export interface ApiResponse{
    replies: never[];
    success:boolean;
    message:string;
    isAcceptingMessage?:boolean
    messages?:Array<Message>
}