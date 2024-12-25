import express from "express";
import {
  getSenderChatId,
  getAllChatId,
  getMyMessage,
  CreateChatID,
} from "../Controller/chatController.js";

const router = express.Router();

router.post("/getSenderChatId", getSenderChatId);
router.post("/getAllChatId", getAllChatId);
router.post("/getMyMessage", getMyMessage);
router.post("/CreateChatID", CreateChatID);

export default router;
