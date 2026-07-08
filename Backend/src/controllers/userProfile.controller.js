import uploadOnCloudinary from "../config/cloudinary.js";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const currUser = catchAsync(async (req, res, next) => {
    const userId = req.userId;
    const user = await userModel.findById(userId).populate("posts followers following");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json({success:true,message:"user data fetch", user});
});

export const suggestUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({_id:{$ne:req.userId}});
    return res.status(200).json({success:true,message:"user data fetch", user})
});

export const getProfile = catchAsync(async (req, res, next) => {
  const { userName } = req.params;

  const user = await userModel
    .findOne({ userName })
    .select("-password")
    .populate("posts");

  if (!user) {
    return next(new AppError("user not found...", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const followHandler = catchAsync(async (req, res, next) => {
  const { targetUserId } = req.params;
  const currUserId = req.userId;

  if (!currUserId || !targetUserId) {
    return next(new AppError("user not found"));
  }

  if (currUserId == targetUserId) {
    return next(new AppError("You cannot follow yourself", 400));
  }

  const currUser = await userModel.findById(currUserId);
  const targetUser = await userModel.findById(targetUserId);

  const isFollowing = currUser.following.includes(targetUserId);

  if (isFollowing) {
    //unfollow logic
    await userModel.findByIdAndUpdate(currUserId, {
      $pull: { following: targetUserId },
    });
    await userModel.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currUserId },
    });

    return res
      .status(200)
      .json({ success: true, message: "Unfollowed successfully" });
  }else{
    //follow logic
    await userModel.findByIdAndUpdate(currUserId,{$push:{following:targetUserId}})
    await userModel.findByIdAndUpdate(targetUserId,{$push:{followers:currUserId}});
    
    return res.status(200).json({success:true,message:"follow successfully"})
  }
});

export const searchHandler = catchAsync(async (req, res, next) => {
    const searchQuery = req.query.q;

    if(!searchQuery){
        return res.status(200).json({ success: true, users: [] });
    }

    // Regex banaya taaki case-insensitive search ho
    const user = await userModel.find({
       $or: [
         {userName: {$regex:searchQuery,$options:"i"}},
         {firstName:{$regex:searchQuery,$options:"i"}}
       ]
    }).select("userName firstName lastName profileImg");

    res.status(200).json({
        success: true,
        users
    });
});

export const editProfile = catchAsync(async (req, res, next) => {
    const {userName,firstName,lastName,bio} = req.body;

    const updateData = {};
    if(userName) updateData.userName = userName;
    if(firstName) updateData.firstName = firstName;
    if(lastName) updateData.lastName = lastName;
    if(bio) updateData.bio = bio;

    if(req.file){
        const profileImgUrl = await uploadOnCloudinary(req.file.path);
        if(profileImgUrl){
            updateData.profileImg = profileImgUrl;
        }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        req.userId,
        updateData,
        {new:true,runValidators:true}
    );

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
    });
});

export const updatePassword = catchAsync(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new AppError("Please provide both old and new passwords", 400));
    }

    // user ko find karo aur password bhi maango (+password) kyunki humne select:false kiya hua hai
    const user = await userModel.findById(req.user.id).select("+password");

    // Purana password compare karo
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return next(new AppError("Incorrect old password", 401));
    }

    // Naya password hash karke save karo
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

export const deleteAccount = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    // 1. (Optional but Recommended) User ki banayi gayi saari posts bhi delete kardo
    // Warna database mein 'orphaned' posts reh jayengi jinka author exist nahi karta
    await postModel.deleteMany({ author: userId });

    // 2. User ko delete karo
    await userModel.findByIdAndDelete(userId);

    // 3. User ko system se log out karne ke liye cookie clear kardo
    res.clearCookie("token").status(200).json({
        success: true,
        message: "Account and associated posts deleted successfully"
    });
});

