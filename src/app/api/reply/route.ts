
import { dbConnect } from "@/lib/dbConnect";
import { Reply, UserModel } from "@/model/User";

import { } from "@/model/User";
import { useParams } from "next/navigation";

export async function POST(request:Request){
    
    await dbConnect();
    const { username,content,message} = await request.json();
    console.log(username)
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

        // is user accepting the messages   
        
        const newReply = {message,content, createAt: new Date()}
        user.reply.push( newReply as Reply )
        await user.save()
        return Response.json(
            {
                success:true,
                message:"reply sent succesfully."
            },
            {status:200}
        )

    }catch (error){
        console.error("Error in reply:",error)
        return Response.json(
            {
                success:false,
                message:"reply not sent."
            },
            {status:500}
        )
    }
}