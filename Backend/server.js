import app from "./src/app.js"
import dotenv from "dotenv";
import connectDatabase from "./src/config/db.js";
import logger from "./src/utils/logger.js";

dotenv.config();
const port = process.env.PORT || 8000; 

connectDatabase();

app.listen(port,()=>{
    // console.log("server is running")
    logger.info("Server started on port 8000")
})