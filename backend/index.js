import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoute from "./routes/user.route.js"
dotenv.config({});
const app = express();
const port = process.env.PORT || 8000

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I'm comming from backend",
    success: true
  });
});

//middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/api/v1/user',userRoute)


const startServer = async () => {
  try {
    await connectDb(); 
    console.log("Database connected successfully ");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port} `);
    });

  } catch (error) {
    console.error("Failed to start server ", error);
    process.exit(1); 
  }
};

startServer()