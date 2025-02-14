import express, { Request, Response, NextFunction } from "express";
import { upload } from "../middleware/uploadfile";
import { transcribeAudio } from "../controllers/transcribe";
const router = express.Router()

router.post('/uploadverser', upload.single("audio"), (req: Request, res: Response) => {
    transcribeAudio(req, res);
  });
export default router;