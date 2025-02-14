import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import axios from "axios";
import { AssemblyAI } from 'assemblyai';
import { extractBibleVerses } from "./bibletext";
import {getVerses} from "./getVerse"
const API_KEY = "ace4097e575845b1a81aa763c093f107";
export const transcribeAudio = async (req: Request, res: Response): Promise<Response | void> => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    // Get the uploaded file path
    const audioPath = path.join(__dirname, "../../uploads", req.file.filename);
    console.log("Processing file:", audioPath);
    
    // Send the file URL to AssemblyAI for transcription
    const client = new AssemblyAI({
      apiKey: 'ace4097e575845b1a81aa763c093f107',
    });
    
    const FILE_URL =audioPath
    console.log(FILE_URL)
    // You can also transcribe a local file by passing in a file path
    // const FILE_URL = './path/to/file.mp3';
    
    // Request parameters 
    const data = {
      audio: FILE_URL
    }
    
    const run = async () => {
      const transcript = await client.transcripts.transcribe(data);
      console.log(transcript.text);
      const updateText=extractBibleVerses(transcript.text)
      console.log(updateText)
      const result=await getVerses(updateText)
      console.log(result)
      return res.status(201).json({data:result})
    };
    
    run();

}catch(error){
  console.error(error);
}
}

