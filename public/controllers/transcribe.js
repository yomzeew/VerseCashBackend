"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudio = void 0;
const path_1 = __importDefault(require("path"));
const assemblyai_1 = require("assemblyai");
const bibletext_1 = require("./bibletext");
const getVerse_1 = require("./getVerse");
const API_KEY = process.env.API_KEY;
const transcribeAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        // Get the uploaded file path
        const audioPath = path_1.default.join(__dirname, "../../uploads", req.file.filename);
        console.log("Processing file:", audioPath);
        // Send the file URL to AssemblyAI for transcription
        const client = new assemblyai_1.AssemblyAI({
            apiKey: API_KEY,
        });
        const FILE_URL = audioPath;
        console.log(FILE_URL);
        // You can also transcribe a local file by passing in a file path
        // const FILE_URL = './path/to/file.mp3';
        // Request parameters 
        const data = {
            audio: FILE_URL
        };
        const run = () => __awaiter(void 0, void 0, void 0, function* () {
            const transcript = yield client.transcripts.transcribe(data);
            console.log(transcript.text);
            const updateText = (0, bibletext_1.extractBibleVerses)(transcript.text);
            console.log(updateText);
            const result = yield (0, getVerse_1.getVerses)(updateText);
            console.log(result);
            return res.status(201).json({ data: result });
        });
        run();
    }
    catch (error) {
        console.error(error);
    }
});
exports.transcribeAudio = transcribeAudio;
