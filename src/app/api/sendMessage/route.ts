import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

import { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    const {userName, content} = await request.json();
    try{
        const user = await UserModel.findOne({userName});
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
        if(!user.isAcceptingMessage){
            return Response.json(
            {
                success:false,
                message:"User is not accepting messages."
            },
            {status:403}
        )
        }
        const newMessage = {content, createAt: new Date()}
        user.messages.push( newMessage as Message )
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