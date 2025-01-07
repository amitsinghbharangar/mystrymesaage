import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

import { Reply } from "@/model/User";
export async function POST(request:Request){
    const {content, messageId} = await request.json();
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User ;
    const username = user?.username;
    if(!session || !session.user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {status:401}
        )
    }
    try{
        const user = await UserModel.findOne({username:username});
        if(!user){
            return Response.json(
            {
                success:false,
                message:"User not found"
            },
            {status:404}
        )
        }
        const newReply = {messageId,content,createdAt:new Date()}
        user.reply.push(newReply as Reply);
        
        await user.save()
        return Response.json(
            {
                success:true,
                message:"message sent succesfully."
            },
            {status:200}
        )

    }catch (error){
        console.error("Error sending message:",error)
        return Response.json(
            {
                success:false,
                message:"message not sent."
            },
            {status:500}
        )
    }
}