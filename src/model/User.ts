import mongoose, {Schema, Document} from 'mongoose'

export interface Message extends Document{
    content :string;
    createAt :Date   

}

const MessageSchema : Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    userName :string;
    email :string;
    password:string;
    isVerified:boolean,
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAcceptingMessage:boolean;
    messages:Message[]  

}

const UserSchema : Schema<User> = new Schema({
    userName:{
        type:String,
        required:[true,"UserName is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"UserName is required"],
        unique:true,
        match:[/.+\@.+\..+/,"please use a valid email address"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"verify code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code Expiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:false,
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)