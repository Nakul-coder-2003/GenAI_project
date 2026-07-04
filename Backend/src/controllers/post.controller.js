import uploadOnCloudinary from "../config/cloudinary.js";
import { postModel } from "../models/post.model.js";
import userModel from "../models/user.model.js";

export const uploadpost = async(req,res)=>{
    try {
        const {mediaType, caption} = req.body;
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path);
        }else{
            return res.status(400).json({message:"media is required!"})
        }

        const NewPost = await postModel.create({
           mediaType,
           caption,
           media,
           author:req.user.id
        })

        const user = await userModel.findById(req.user.id);
        user.posts.push(NewPost._id);
        await user.save();

        const populatePost = await postModel.findById(NewPost._id).populate(
            "author",
            "firstName username profileImg"
        )
        return res.status(200).json({
            message:"post created!",
            post:NewPost,
            populatePost:populatePost
        })
    } catch (error) {
        console.log(`upload error ${error}`)
    }
}

export const getAllPosts = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(`get posts error ${error}`)
    }
}

export const likePost = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(`get posts error ${error}`)
    }
}

export const commentPost = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(`get posts error ${error}`)
    }
}

export const deletePost = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(`get posts error ${error}`)
    }
}
