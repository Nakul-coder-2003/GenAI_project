import {Server} from "socket.io"

let io;

export const initializeSocket = (server)=>{
   // Socket.io Server initialize karo aur CORS configure karo
   io = new Server(server,{
    cors: {
            origin: "*", // Testing ke liye sabhi origins allowed hain
            methods: ["GET", "POST"]
        }
   })

   console.log("⚡ Socket.io initialized successfully");

   // Jab bhi koi naya client (frontend/postman) server se connect hoga, ye block chalega.
   io.on("connection",(socket)=>{
        // Har ek connected client ki ek unique socket.id hoti hai
        console.log(`🔌 A user connected! Socket ID: ${socket.id}`);

        socket.on("ping_from_client",(data) => {
            console.log(`📩 Client se data aaya:`,data);

            socket.emit("pong_from_server",{
                message:"Hello from Nakul's Backend Server! Real-time connection works",
                timestamp:new Date()
            })
        })

        socket.on("disconnect",()=>{
            console.log(`❌ User disconnected. Socket ID: ${socket.id}`)
        });
   });
   return io;
}