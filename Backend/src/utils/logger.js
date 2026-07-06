import winston from "winston";

const logger = winston.createLogger({
  level: "info", // Info aur usse bade levels (warn, error) sab log honge
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Files setup
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    
    // 🟢 Console Transport ko seedhe yahan add karein taaki yeh hamesha chale
    new winston.transports.Console({
      level: "info", // Console par error aur info dono dikhane ke liye
      format: winston.format.combine(
        winston.format.colorize(), // Console logs ko colorful banane ke liye
        winston.format.errors({ stack: true }), // Error ka stack trace dikhane ke liye
        winston.format.simple() // Padhne mein aasan format
      ),
    }),
  ],
});

export default logger;
