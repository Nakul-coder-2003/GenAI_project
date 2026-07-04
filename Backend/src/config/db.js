import mongoose from "mongoose"
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);

const connectDatabase = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database is successfully connected!")
    } catch (error) {
        console.log(`database error! ${error}`)
    }
}

export default connectDatabase;