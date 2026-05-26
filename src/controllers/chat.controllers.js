import { asyncHandler } from "../utils/asyncHandler.js";
import {
  buildChannelSummary,
  createChannelMessage,
  createChannelRecord,
  deleteChannelMessage,
  getChannelRecord,
  leaveChannelRecord,
  joinChannelRecord,
  listChannelMembers,
  listChannelMessages,
  listChannels,
  markChannelAsReadRecord,
  updateChannelMessage,
} from "../services/chat.service.js";

export const createChannel = asyncHandler(async (req, res) => {
  const channel = await createChannelRecord(req.body);

  return res.status(201).json({
    message: "Channel created successfully",
    channel: buildChannelSummary(channel),
  });
});

export const getChannels = asyncHandler(async (req, res) => {
  const { userId, includePrivate = "false" } = req.query;
  const channels = await listChannels({
    userId,
    includePrivate: includePrivate === "true",
  });

  return res.status(200).json({
    message: "Channels fetched successfully",
    count: channels.length,
    channels: channels.map(buildChannelSummary),
  });
});

export const getChannelById = asyncHandler(async (req, res) => {
  const channel = await getChannelRecord(req.params.id);

  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }

  return res.status(200).json({
    message: "Channel fetched successfully",
    channel,
  });
});

export const joinChannel = asyncHandler(async (req, res) => {
  const channel = await joinChannelRecord(req.params.id, req.body.userId);

  return res.status(200).json({
    message: "Joined channel successfully",
    channel,
  });
});

export const leaveChannel = asyncHandler(async (req, res) => {
  const channel = await leaveChannelRecord(req.params.id, req.body.userId);

  return res.status(200).json({
    message: "Left channel successfully",
    channel,
  });
});

export const getChannelMembers = asyncHandler(async (req, res) => {
  const channel = await listChannelMembers(req.params.id);

  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }

  return res.status(200).json({
    message: "Channel members fetched successfully",
    count: channel.members.length,
    members: channel.members,
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = await createChannelMessage({
    channelId: req.params.id,
    userId: req.body.userId,
    content: req.body.content,
  });

  return res.status(201).json({
    message: "Message sent successfully",
    data: message,
  });
});

export const getChannelMessages = asyncHandler(async (req, res) => {
  const payload = await listChannelMessages({
    channelId: req.params.id,
    page: req.query.page,
    limit: req.query.limit,
  });

  return res.status(200).json({
    message: "Messages fetched successfully",
    ...payload,
  });
});

export const updateMessage = asyncHandler(async (req, res) => {
  const message = await updateChannelMessage({
    channelId: req.params.channelId,
    messageId: req.params.messageId,
    userId: req.body.userId,
    content: req.body.content,
  });

  return res.status(200).json({
    message: "Message updated successfully",
    data: message,
  });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await deleteChannelMessage({
    channelId: req.params.channelId,
    messageId: req.params.messageId,
    userId: req.body.userId,
  });

  return res.status(200).json({
    message: "Message deleted successfully",
  });
});

export const markChannelAsRead = asyncHandler(async (req, res) => {
  await markChannelAsReadRecord(req.params.id, req.body.userId);

  return res.status(200).json({
    message: "Channel marked as read",
  });
});

