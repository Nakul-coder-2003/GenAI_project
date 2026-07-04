import app from "./src/app.js"
import dotenv from "dotenv";
import connectDatabase from "./src/config/db.js";

dotenv.config();
const port = process.env.PORT || 8000; 

connectDatabase();

app.listen(port,()=>{
    console.log("server is running")
})