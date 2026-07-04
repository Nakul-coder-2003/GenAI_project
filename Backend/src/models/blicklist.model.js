import mongoose from "mongoose";

const blocklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "token is required to be added in blacklist" ]
    }
},{timestamps:true});

export const blocklistModel = mongoose.model("blocklist",blocklistSchema);