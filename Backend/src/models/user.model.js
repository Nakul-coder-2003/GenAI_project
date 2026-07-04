import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
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
        required:true
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
    ]
},{timestamps:true});

const userModel = mongoose.model("User",userSchema);

export default userModel;

