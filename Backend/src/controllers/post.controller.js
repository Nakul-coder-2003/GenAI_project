import uploadOnCloudinary from "../config/cloudinary.js";
import { postModel } from "../models/post.model.js";
import userModel from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js";

export const uploadpost = catchAsync(async (req, res) => {
    const { mediaType, caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required!" });
    }

    const NewPost = await postModel.create({
      mediaType,
      caption,
      media,
      author: req.userId,
    });

    // const user = await userModel.findById(req.userId);
    // user.posts.push(NewPost._id);
    // await user.save();

    // Update User Document
    await userModel.findByIdAndUpdate(req.userId, {
      $push: { posts: newPost._id }
    });

    const populatePost = await postModel
      .findById(NewPost._id)
      .populate("author", "firstName username profileImg");

    return res.status(200).json({
      success: true,
      message: "post created!",
      post: populatePost,
    });
});

export const getAllPosts = async (req, res) => {
  try {
    const { page, limit, sort, mediaType, search } = req.query;
    const queryObj = {};
    if (mediaType) {
        queryObj.mediaType = mediaType;
    }
    if (search) {
        queryObj.caption = { $regex: search, $options: "i" }; // 'i' means case-insensitive
    }
    const posts = await postModel.find(queryObj)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "username firstName lastName profileImg");

    // let postQuery = postModel.find(queryObj).sort(sort).skip((page-1)*limit).limit(limit).populate("aithor")
    // const posts = await postQuery;
 
    const totalPosts = await postModel.countDocuments(queryObj);
    const totalPages = Math.ceil(totalPosts / limit);
    res.status(200).json({
        success: true,
        results: posts.length,
        metadata: {
            totalPosts,
            totalPages,
            currentPage: page,
            limit
        },
        data: {
            posts
        }
    });
  } catch (error) {
    console.log(`get posts error ${error}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await postModel.findById(postId);

    if(!post){
        return res.status(400).json({message:"post not found"});
    }

    // const alreadyLiked = post.likes.some(
    //     (id) => id.toString() == req.userId.toString()
    // )
    // if(alreadyLiked){
    //    post.likes = post.likes.filter(
    //      (id) => id.toString() != req.userId.toString()
    //    )
    // }else{
    //    post.likes.push(req.userId)
    // }

    const isLiked = post.likes.includes(req.userId);
    // Pure array ko map/filter karne ke bajaye Mongoose ka pull/push use karein (Fast)
    if (isLiked) {
      await post.likes.pull(req.userId); // Automatically removes ID
    } else {
      await post.likes.push(req.userId); // Adds ID
    }

    await post.save();
    await post.populate("author", "name username profileImg");
    return res.status(200).json({
        success: true,
        message: isLiked ? "Post unliked" : "Post liked",
        post,
    })
  } catch (error) {
    console.log(`get posts error ${error}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const {message} = req.body;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);
    if(!post){
        return res.status(400).json({
            message:"post not found!"
        })
    }

    post.comments.push({
        author:req.userId,
        message
    })

    await post.save();
    await post.populate("author", "name username profileImg");
    return res.status(200).json({
        success: true,
        message: "add comments",
        post,
    })
  } catch (error) {
    console.log(`get posts error ${error}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const {postId} = req.params;
    const post = await postModel.findById(postId);

    if(!post){
      return res.status(400).json({success: "false" ,message:"post not fount!"})
    }

    // 🔒 Security Check:
    if(post.author.toString() !== req.userId.toString()){
      return res.status(400).json({success: "false",message:"unauthoraized user"})
    }

    //delete post
    await post.findByIdAndDelete(postId);

    // User ke posts array se bhi is id ko hatayein
    await userModel.findByIdAndUpdate(req.userId, {
      $pull : {posts: postId}
    })

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully!",
    });

  } catch (error) {
    console.error(`Delete post error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const editPost = async(req,res)=>{
  try {
    const {postId} = req.params;
    const {caption} = req.body;
    const post = await postModel.findById(postId);

    if(!post){
      return res.status(400).json({success: "false" ,message:"post not fount!"})
    }

    //🔒 Security Check:
    if(post.author.toString() !== req.userId.toString()){
      return res.status(400).json({success: "false",message:"unauthoraized user"})
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      {$set: {caption}},
      {new:true} // Isse updated data return hota hai
    ).populate("author","firstName username profileImg");

    return res.status(200).json({
      success:true,
      message:"post update successfully!",
      post: updatedPost
    })

  } catch (error) {
    console.error(`edit post error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const savedPost = async(req,res)=>{
  try {
    const {postId} = req.params;
    const post = await postModel.findById(postId);
    const user = await userModel.findById(req.userId);

    if(!post){
      return res.status(400).json({message:"post not found"})
    }

    const isSaved = user.saved.includes(postId);
    if(isSaved){
      //unsaved logic
      await user.saved.pull(postId);
    }else{
      await user.saved.push(postId);
    }
    
    await user.save();
    return res.status(200).json({
      success:true,
      message:"post saved successfully!"
    })
  } catch (error) {
    console.error(`saved post error: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const getUserPosts = catchAsync(async (req,res,next)=>{
    const {userId} = req.params;
    const {page,limit,sort,mediaType} = req.query;

    const queryObj = {author : userId};

    if(mediaType){
      queryObj.mediaType = mediaType;
    }

    let postQuery = postModel.find(queryObj)
          .sort(sort)
          .skip((page-1)*limit)
          .limit(limit);

    const posts = await postQuery;

    // Total counts nikal lo metadata ke liye
    const totalPosts = await postModel.countDocuments(queryObj);
    const totalPages = Math.ceil(totalPosts/limit);

    res.status(200).json({
      success:true,
      results:posts.length,
      metaData:{
        totalPages,
        totalPosts,
        currentPage:page,
        limit
      },
      data:{
        posts
      }
    })
});