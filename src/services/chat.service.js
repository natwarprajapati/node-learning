import mongoose from "mongoose";
import User from "../models/user.models.js";
import Channel from "../models/channel.models.js";
import Message from "../models/message.models.js";

export const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const logChatEvent = (event, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[chat][${timestamp}][${event}]`, details);
};

const createSlug = (name) => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
};

const getMemberIndex = (channel, userId) =>
  channel.members.findIndex((member) => String(member.user) === String(userId));

const populateChannel = async (channelId) =>
  Channel.findById(channelId)
    .populate("createdBy", "name age createdAt")
    .populate("members.user", "name age createdAt");

export const buildChannelSummary = (channel) => ({
  _id: channel._id,
  name: channel.name,
  slug: channel.slug,
  description: channel.description,
  isPrivate: channel.isPrivate,
  createdBy: channel.createdBy,
  membersCount: channel.members?.length || 0,
  createdAt: channel.createdAt,
  updatedAt: channel.updatedAt,
});

export const createChannelRecord = async ({ name, description = "", isPrivate = false, createdBy }) => {
  if (!isValidObjectId(createdBy)) {
    const error = new Error("Invalid createdBy userId");
    error.statusCode = 400;
    throw error;
  }

  const creator = await User.findById(createdBy);
  if (!creator) {
    const error = new Error("Creator user not found");
    error.statusCode = 404;
    throw error;
  }

  const channel = await Channel.create({
    name,
    slug: createSlug(name),
    description,
    isPrivate,
    createdBy,
    members: [
      {
        user: createdBy,
        role: "admin",
      },
    ],
  });

  return populateChannel(channel._id);
};

export const listChannels = async ({ userId, includePrivate = false }) => {
  const filter = {};

  if (userId && isValidObjectId(userId)) {
    return Channel.find({
      $or: [
        { isPrivate: false },
        { "members.user": userId },
      ],
    })
      .populate("createdBy", "name age")
      .sort({ updatedAt: -1 });
  }

  if (!includePrivate) {
    filter.isPrivate = false;
  }

  return Channel.find(filter)
    .populate("createdBy", "name age")
    .sort({ updatedAt: -1 });
};

export const getChannelRecord = async (channelId) =>
  populateChannel(channelId);

export const joinChannelRecord = async (channelId, userId) => {
  if (!isValidObjectId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 400;
    throw error;
  }

  const [channel, user] = await Promise.all([
    Channel.findById(channelId),
    User.findById(userId),
  ]);

  if (!channel) {
    const error = new Error("Channel not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const memberIndex = getMemberIndex(channel, userId);
  if (memberIndex !== -1) {
    channel.members[memberIndex].lastReadAt = new Date();
    await channel.save();
    logChatEvent("user-joined", {
      userId,
      channelId,
      channelName: channel.name,
      alreadyMember: true,
    });
    return populateChannel(channel._id);
  }

  channel.members.push({
    user: userId,
    role: "member",
    joinedAt: new Date(),
    lastReadAt: new Date(),
  });

  await channel.save();
  logChatEvent("user-joined", {
    userId,
    channelId,
    channelName: channel.name,
    alreadyMember: false,
  });
  return populateChannel(channel._id);
};

export const leaveChannelRecord = async (channelId, userId) => {
  if (!isValidObjectId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 400;
    throw error;
  }

  const channel = await Channel.findById(channelId);

  if (!channel) {
    const error = new Error("Channel not found");
    error.statusCode = 404;
    throw error;
  }

  const memberIndex = getMemberIndex(channel, userId);
  if (memberIndex === -1) {
    const error = new Error("User is not a member of this channel");
    error.statusCode = 400;
    throw error;
  }

  const member = channel.members[memberIndex];
  if (member.role === "admin" && channel.members.length === 1) {
    const error = new Error(
      "Channel owner cannot leave the last remaining member. Delete the channel instead."
    );
    error.statusCode = 400;
    throw error;
  }

  if (member.role === "admin" && channel.members.length > 1) {
    const nextAdminIndex = channel.members.findIndex(
      (channelMember, index) =>
        index !== memberIndex && String(channelMember.user) !== String(userId)
    );

    if (nextAdminIndex !== -1) {
      channel.members[nextAdminIndex].role = "admin";
    }
  }

  channel.members.splice(memberIndex, 1);
  await channel.save();

  return populateChannel(channel._id);
};

export const listChannelMembers = async (channelId) =>
  Channel.findById(channelId).populate("members.user", "name age");

export const markChannelAsReadRecord = async (channelId, userId) => {
  if (!isValidObjectId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 400;
    throw error;
  }

  const channel = await Channel.findById(channelId);
  if (!channel) {
    const error = new Error("Channel not found");
    error.statusCode = 404;
    throw error;
  }

  const memberIndex = getMemberIndex(channel, userId);
  if (memberIndex === -1) {
    const error = new Error("User must join the channel first");
    error.statusCode = 403;
    throw error;
  }

  channel.members[memberIndex].lastReadAt = new Date();
  await channel.save();

  return populateChannel(channel._id);
};

export const listChannelMessages = async ({ channelId, page = 1, limit = 20 }) => {
  const safePage = Math.max(parseInt(page, 10) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const channel = await Channel.findById(channelId);
  if (!channel) {
    const error = new Error("Channel not found");
    error.statusCode = 404;
    throw error;
  }

  const messages = await Message.find({
    channel: channelId,
    deletedAt: null,
  })
    .populate("sender", "name age")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit);

  const total = await Message.countDocuments({
    channel: channelId,
    deletedAt: null,
  });

  return {
    page: safePage,
    limit: safeLimit,
    total,
    pages: Math.ceil(total / safeLimit),
    messages: messages.reverse(),
  };
};

export const createChannelMessage = async ({ channelId, userId, content }) => {
  if (!isValidObjectId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 400;
    throw error;
  }

  const [channel, user] = await Promise.all([
    Channel.findById(channelId),
    User.findById(userId),
  ]);

  if (!channel) {
    const error = new Error("Channel not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const memberIndex = getMemberIndex(channel, userId);
  if (memberIndex === -1) {
    const error = new Error("You must join the channel before sending messages");
    error.statusCode = 403;
    throw error;
  }

  const message = await Message.create({
    channel: channelId,
    sender: userId,
    content,
  });

  channel.members[memberIndex].lastReadAt = new Date();
  await channel.save();
  logChatEvent("channel-message", {
    channelId,
    channelName: channel.name,
    userId,
    userName: user.name,
    messageId: String(message._id),
    content: content.length > 120 ? `${content.slice(0, 120)}...` : content,
  });

  return Message.findById(message._id)
    .populate("sender", "name age")
    .populate("channel", "name slug");
};

export const updateChannelMessage = async ({ channelId, messageId, userId, content }) => {
  if (!isValidObjectId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 400;
    throw error;
  }

  const message = await Message.findOne({
    _id: messageId,
    channel: channelId,
    deletedAt: null,
  });

  if (!message) {
    const error = new Error("Message not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(message.sender) !== String(userId)) {
    const error = new Error("You can only edit your own messages");
    error.statusCode = 403;
    throw error;
  }

  message.content = content;
  message.editedAt = new Date();
  await message.save();

  return Message.findById(message._id).populate("sender", "name age");
};

export const deleteChannelMessage = async ({ channelId, messageId, userId }) => {
  if (!isValidObjectId(userId)) {
    const error = new Error("Invalid userId");
    error.statusCode = 400;
    throw error;
  }

  const message = await Message.findOne({
    _id: messageId,
    channel: channelId,
    deletedAt: null,
  });

  if (!message) {
    const error = new Error("Message not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(message.sender) !== String(userId)) {
    const error = new Error("You can only delete your own messages");
    error.statusCode = 403;
    throw error;
  }

  message.deletedAt = new Date();
  await message.save();

  return true;
};
