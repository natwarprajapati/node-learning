import {
  createChannelMessage,
  deleteChannelMessage,
  joinChannelRecord,
  leaveChannelRecord,
  markChannelAsReadRecord,
  updateChannelMessage,
} from "../services/chat.service.js";

const roomName = (channelId) => `channel:${channelId}`;

const emitChannelEvent = async (io, channelId, eventName, payload) => {
  io.to(roomName(channelId)).emit(eventName, payload);
};

const withAck = (ack, payload) => {
  if (typeof ack === "function") {
    ack(payload);
  }
};

export const registerChatSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("chat:channel:join", async (payload = {}, ack) => {
      try {
        const { channelId, userId } = payload;
        const channel = await joinChannelRecord(channelId, userId);
        const room = roomName(channelId);

        socket.join(room);
        socket.data.userId = userId;

        const response = { message: "Joined channel successfully", channel };
        withAck(ack, response);
        socket.to(room).emit("chat:channel:member-joined", response);
      } catch (error) {
        withAck(ack, {
          error: error.message || "Failed to join channel",
        });
      }
    });

    socket.on("chat:channel:leave", async (payload = {}, ack) => {
      try {
        const { channelId, userId } = payload;
        const channel = await leaveChannelRecord(channelId, userId);
        const room = roomName(channelId);

        socket.leave(room);

        const response = { message: "Left channel successfully", channel };
        withAck(ack, response);
        socket.to(room).emit("chat:channel:member-left", response);
      } catch (error) {
        withAck(ack, {
          error: error.message || "Failed to leave channel",
        });
      }
    });

    socket.on("chat:channel:read", async (payload = {}, ack) => {
      try {
        const { channelId, userId } = payload;
        const channel = await markChannelAsReadRecord(channelId, userId);
        const response = {
          message: "Channel marked as read",
          channel,
        };

        withAck(ack, response);
        socket.to(roomName(channelId)).emit("chat:channel:read-updated", response);
      } catch (error) {
        withAck(ack, {
          error: error.message || "Failed to mark channel as read",
        });
      }
    });

    socket.on("chat:message:send", async (payload = {}, ack) => {
      try {
        const { channelId, userId, content } = payload;
        const message = await createChannelMessage({ channelId, userId, content });
        const response = { message: "Message sent successfully", data: message };

        withAck(ack, response);
        await emitChannelEvent(io, channelId, "chat:message:new", response);
      } catch (error) {
        withAck(ack, {
          error: error.message || "Failed to send message",
        });
      }
    });

    socket.on("chat:message:edit", async (payload = {}, ack) => {
      try {
        const { channelId, messageId, userId, content } = payload;
        const message = await updateChannelMessage({
          channelId,
          messageId,
          userId,
          content,
        });

        const response = { message: "Message updated successfully", data: message };
        withAck(ack, response);
        await emitChannelEvent(io, channelId, "chat:message:updated", response);
      } catch (error) {
        withAck(ack, {
          error: error.message || "Failed to edit message",
        });
      }
    });

    socket.on("chat:message:delete", async (payload = {}, ack) => {
      try {
        const { channelId, messageId, userId } = payload;
        await deleteChannelMessage({
          channelId,
          messageId,
          userId,
        });

        const response = {
          message: "Message deleted successfully",
          data: { channelId, messageId },
        };

        withAck(ack, response);
        await emitChannelEvent(io, channelId, "chat:message:deleted", response);
      } catch (error) {
        withAck(ack, {
          error: error.message || "Failed to delete message",
        });
      }
    });
  });
};

