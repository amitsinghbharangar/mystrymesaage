
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";

export async function GET(request:Request){
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    await dbConnect();
    try{
    const user = await UserModel.aggregate([
      { $match: { username } }, // Match user by username
      { $unwind: '$reply' }, // Unwind replies array for sorting
      { $sort: { 'reply.createdAt': -1 } }, // Sort by creation date (descending)
      {
        $group: {
          _id: '$username', // Group back by username
          reply: { $push: '$reply' }, // Push replies into an array
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: 'No replies found for this user',
        },
        { status: 404 }
      );
    }
    console.log("Reply details are :",user)
    return Response.json(
      {
        success: true,
        replies: user[0].reply,
      },
      { status: 200 }
    );
    } catch (error) {
        console.error("Unexpected error occured :", error)
        return Response.json(
            {
                success:false,
                message:"Error getting messages."
            },
            {status:500}
        )
    }

}