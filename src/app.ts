import "./utils/instrument"
import * as Sentry from "@sentry/node";
import express, { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import Log from "./utils/loggers";
import Config from "./utils/config";
import bodyParser from 'body-parser';


dotenv.config();
const app = express();
const port: number = Config.serverPort 
const version: string = "v1";
import uploadRoutes from './routes/uploadRoutes'
import { extractBibleVerses } from "./controllers/bibletext";


app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false }));
app.get("/health", (req: Request, res: Response) => {
  res.send(`Welcome to Cash Verse ${process.env.SERVER_NAME} Service`);
});

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

 //use Routes for api 
 app.use('/upload',uploadRoutes)
 app.use('/uploads', express.static('uploads'));

 console.log('test',extractBibleVerses('Ninja. Isaiah, chapter one, verse two.'))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

Sentry.captureException(new Error("Manual test error from Sentry"))
// but before any and other error-handling middlewares are defined
Sentry.setupExpressErrorHandler(app);
app.listen(port, async() => {
  Log.success(`API is Alive and running 🚀 on port ${port}`);
});
