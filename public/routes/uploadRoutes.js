"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadfile_1 = require("../middleware/uploadfile");
const transcribe_1 = require("../controllers/transcribe");
const router = express_1.default.Router();
router.post('/uploadverser', uploadfile_1.upload.single("audio"), (req, res) => {
    (0, transcribe_1.transcribeAudio)(req, res);
});
exports.default = router;
