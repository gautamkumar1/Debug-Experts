import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js"
import { errorMiddleware } from './middlewares/errorMiddleware.js';
const app = express();
config({ path: "./config/config.env" });

// Connected frontend to backend

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET","POST","DELETE","PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Message Router
app.use("/api/v1/message", messageRouter);

dbConnection();

app.use(errorMiddleware)
export default app