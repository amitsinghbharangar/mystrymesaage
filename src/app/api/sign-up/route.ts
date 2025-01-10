import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export async function POST(request:NextRequest){
    await dbConnect()
    try{
        const {username, email, password} = await request.json()
        console.log("Incoming username:", username);
        if (!username || !email || !password) {
          return Response.json(
            { success: false, message: "All fields are required." },
            { status: 400 }
          );
        }

        if (!username.trim()) {
          return Response.json(
            { success: false, message: "Username cannot be empty." },
            { status: 400 }
          );
        }
        //find the username if exists 
        const existingVerifiedUser = await UserModel.findOne({
            username,isVerified:true
        })
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:'Username is already taken'
            },{status:400})
        }else{
          console.log("username is available return response true")
        }

    //  check if user exits with this email
        const existingUserByEmail = await UserModel.findOne({email})

        // create verify code 
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserByEmail){

            if(existingUserByEmail.isVerified){
                return Response.json({
                success:false,
                message:"User already exits with this email! Please use another email."
            },{status:400})
            }else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);
                console.log("everything is fine here")
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() +1 )
    
        //  now create user
            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                isVerified:false,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isAcceptingMessage:true,
                messages:[],
                reply:[]

            })
            console.log("Everything is fine")
            console.log(newUser)
            await newUser.save()

        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
                success:true,
                message:"User registered successfully. Please verify your email."
            },{status:201})
    }catch(error){
      if (
        error instanceof mongoose.Error ||
        (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as any).code === 11000)
    ) {
        const duplicateField = Object.keys((error as any).keyValue)[0];
        if (duplicateField === "username") {
            throw new Error("This username is already taken. Please choose another.");
        }
        throw new Error(`${duplicateField} is already taken.`);
    } else {
        console.error("Unexpected error while saving user:", error);
        throw new Error("An unexpected error occurred.");
    }
  }
  }
