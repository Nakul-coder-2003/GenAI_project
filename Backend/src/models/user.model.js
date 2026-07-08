import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        unique:[true,"username already exist"],
        required:true
    },
    email:{
        type:String,
        unique:[true,"Account already exists with this email address"],
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    profileImg:{
        type:String
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    bio:{
        type:String,
        default:""
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    saved:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
},{timestamps:true});

const userModel = mongoose.model("User",userSchema);

export default userModel;

