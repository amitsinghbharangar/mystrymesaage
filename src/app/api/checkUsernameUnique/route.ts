import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import {z} from "zod"
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    userName :userNameValidation
})

export async function GET(request :Request){
    await dbConnect();
    try{
        const {searchParams} = new URL(request.url);
        const queryParam = {
            userName : searchParams.get('userName')
        }
        // validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const userNameErrors = result.error.format().userName?._errors || []
            return Response.json({
                success:false,
                message: userNameErrors?.length > 0
                ? userNameErrors.join(', ')
                : 'Invalid query parameters'
            },{status:400})
        }
        const {userName} = result.data;
        const existingVerifiedUser = await UserModel.findOne({
            userName,isVerified:true
        })
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:'Username is already taken'
            },{status:400})
        }
        return Response.json({
                success:true,
                message:'Username is available'
            },{status:200})
    }catch(error){
        console.error("Error checking username", error);
        return Response.json(
            {
                success:false,
                message:"Error checking username"
            },
            {status : 500}
        )
    }
}