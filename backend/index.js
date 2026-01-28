import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
dotenv.config({});
const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I'm comming from backend",
    success: true,
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

app.listen(port, () => {
  connectDb();
  console.log(`server listen at port http://localhost:${port}`);
});
