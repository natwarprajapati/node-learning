import express from "express";
import validate from "../middlewares/validate.middleware.js";
import {
  createChannel,
  deleteMessage,
  getChannelById,
  getChannelMembers,
  getChannelMessages,
  getChannels,
  joinChannel,
  leaveChannel,
  markChannelAsRead,
  sendMessage,
  updateMessage,
} from "../controllers/chat.controllers.js";
import {
  createChannelSchema,
  deleteMessageSchema,
  joinChannelSchema,
  sendMessageSchema,
  updateMessageSchema,
} from "../validations/chat.validation.js";

const router = express.Router();

router.get("/channels", getChannels);
router.post("/channels", validate(createChannelSchema), createChannel);
router.get("/channels/:id", getChannelById);
router.get("/channels/:id/members", getChannelMembers);
router.post("/channels/:id/join", validate(joinChannelSchema), joinChannel);
router.post("/channels/:id/leave", validate(joinChannelSchema), leaveChannel);
router.post("/channels/:id/read", validate(joinChannelSchema), markChannelAsRead);
router.get("/channels/:id/messages", getChannelMessages);
router.post("/channels/:id/messages", validate(sendMessageSchema), sendMessage);
router.put("/channels/:channelId/messages/:messageId", validate(updateMessageSchema), updateMessage);
router.delete("/channels/:channelId/messages/:messageId", validate(deleteMessageSchema), deleteMessage);

export default router;
