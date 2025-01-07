import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

import { Reply } from "@/model/User";
export async function POST(request:Request){
    await dbConnect();
    const {username, content, messageId} = await request.json();
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