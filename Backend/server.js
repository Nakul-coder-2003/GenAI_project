import app from "./src/app.js"
import dotenv from "dotenv";
import connectDatabase from "./src/config/db.js";
import logger from "./src/utils/logger.js";
import http from "http";
import { initializeSocket } from "./src/config/socket.js";

dotenv.config();
const port = process.env.PORT || 8000; 

// 1. Database Connect
connectDatabase();

// 2. Express App ko Standard HTTP Server mein wrap karana
const server = http.createServer(app);

// 3. WebSockets (Socket.io) ko initialize karna aur server pass karna
initializeSocket(server);

server.listen(port,()=>{
    console.log(`🚀 Server is running on port ${port}`);
    logger.info(`🚀 Server is running on port ${port}`);
})