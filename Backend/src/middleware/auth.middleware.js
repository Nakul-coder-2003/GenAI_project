import jwt from "jsonwebtoken";

export const isAuthenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(400).json({ message: "Please login to access this" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECERET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(`authentication error ${error}`);
  }
};
