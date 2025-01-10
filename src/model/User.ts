import mongoose, {Schema, Document} from 'mongoose'
import uniqueValidator from "mongoose-unique-validator";
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

export interface Reply extends Document {
  message: string; 
  content: string;
  createdAt: Date;
}

const ReplySchema: Schema<Reply> = new Schema({
  message: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document{
    username :string;
    email :string;
    password:string;
    isVerified:boolean,
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAcceptingMessage:boolean;
    messages:Message[];
    reply:Reply[]  

}

const UserSchema : Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Username is required"],
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
    messages:[MessageSchema],
    reply:[ReplySchema]
})
UserSchema.plugin(uniqueValidator, { message: "{PATH} is already taken." });

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)