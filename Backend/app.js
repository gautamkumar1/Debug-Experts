import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
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

export default app