let socket = null;
let currentChannel = null;
let currentUserId = "";
let currentMessages = [];

const els = {
  socketState: document.getElementById("socketState"),
  status: document.getElementById("status"),
  userId: document.getElementById("userId"),
  connectBtn: document.getElementById("connectBtn"),
  loadChannelsBtn: document.getElementById("loadChannelsBtn"),
  createChannelBtn: document.getElementById("createChannelBtn"),
  channelName: document.getElementById("channelName"),
  channelDescription: document.getElementById("channelDescription"),
  channelList: document.getElementById("channelList"),
  activeChannelLabel: document.getElementById("activeChannelLabel"),
  messages: document.getElementById("messages"),
  messageInput: document.getElementById("messageInput"),
  sendBtn: document.getElementById("sendBtn"),
  markReadBtn: document.getElementById("markReadBtn"),
  memberList: document.getElementById("memberList"),
};

const setStatus = (message) => {
  els.status.textContent = message;
};

const setSocketState = (message) => {
  els.socketState.textContent = message;
};

const api = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

const renderChannels = (channels = []) => {
  els.channelList.innerHTML = "";

  if (!channels.length) {
    els.channelList.innerHTML = `<div class="muted">No channels yet.</div>`;
    return;
  }

  channels.forEach((channel) => {
    const active = currentChannel?._id === channel._id ? "active" : "";
    const node = document.createElement("div");
    node.className = `item ${active}`;
    node.innerHTML = `
      <div class="meta">
        <strong>${channel.name}</strong>
        <span>${channel.isPrivate ? "private" : "public"}</span>
      </div>
      <div class="muted">${channel.description || "No description"}</div>
      <div style="height: 8px;"></div>
      <div class="toolbar">
        <button data-join="${channel._id}">Join</button>
        <button class="secondary" data-open="${channel._id}">Open</button>
      </div>
    `;
    els.channelList.appendChild(node);
  });

  els.channelList.querySelectorAll("[data-join]").forEach((button) => {
    button.addEventListener("click", () => joinChannel(button.dataset.join));
  });

  els.channelList.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openChannel(button.dataset.open));
  });
};

const renderMembers = (members = []) => {
  els.memberList.innerHTML = "";

  if (!members.length) {
    els.memberList.innerHTML = `<div class="muted">No members loaded.</div>`;
    return;
  }

  members.forEach((member) => {
    const user = member.user || {};
    const node = document.createElement("div");
    node.className = "item";
    node.innerHTML = `
      <div class="meta">
        <strong>${user.name || "Unknown"}</strong>
        <span>${member.role || "member"}</span>
      </div>
      <div class="muted">${user._id || ""}</div>
    `;
    els.memberList.appendChild(node);
  });
};

const renderMessages = () => {
  els.messages.innerHTML = "";

  if (!currentMessages.length) {
    els.messages.innerHTML = `<div class="muted">No messages yet.</div>`;
    return;
  }

  currentMessages.forEach((message) => {
    const mine = String(message.sender?._id || message.sender) === String(currentUserId);
    const node = document.createElement("div");
    node.className = `message ${mine ? "mine" : ""}`;
    node.innerHTML = `
      <div class="meta">
        <strong>${message.sender?.name || "Unknown"}</strong>
        <span>${new Date(message.createdAt).toLocaleString()}</span>
      </div>
      <div>${escapeHtml(message.content)}</div>
      <small>${message.editedAt ? "edited" : ""}</small>
    `;
    els.messages.appendChild(node);
  });

  els.messages.scrollTop = els.messages.scrollHeight;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const loadChannels = async () => {
  if (!currentUserId) {
    setStatus("Enter a user id first.");
    return;
  }

  const data = await api(`/api/v1/chat/channels?userId=${encodeURIComponent(currentUserId)}`);
  renderChannels(data.channels || []);
};

const loadMembers = async (channelId) => {
  const data = await api(`/api/v1/chat/channels/${channelId}/members`);
  renderMembers(data.members || []);
};

const loadMessages = async (channelId) => {
  const data = await api(`/api/v1/chat/channels/${channelId}/messages?limit=50`);
  currentMessages = data.messages || [];
  renderMessages();
};

const openChannel = async (channelId) => {
  const data = await api(`/api/v1/chat/channels/${channelId}`);
  currentChannel = data.channel;
  els.activeChannelLabel.textContent = `${currentChannel.name} (${currentChannel._id})`;
  renderChannels((await api(`/api/v1/chat/channels?userId=${encodeURIComponent(currentUserId)}`)).channels || []);
  await loadMembers(channelId);
  await loadMessages(channelId);
};

const joinChannel = async (channelId) => {
  if (!socket || !socket.connected) {
    setStatus("Connect socket first.");
    return;
  }

  socket.emit("chat:channel:join", { channelId, userId: currentUserId }, async (response) => {
    if (response?.error) {
      setStatus(response.error);
      return;
    }

    currentChannel = response.channel;
    els.activeChannelLabel.textContent = `${currentChannel.name} (${currentChannel._id})`;
    setStatus(response.message || "Joined channel");
    await loadChannels();
    await loadMembers(channelId);
    await loadMessages(channelId);
  });
};

const sendMessage = () => {
  if (!currentChannel) {
    setStatus("Join a channel first.");
    return;
  }

  const content = els.messageInput.value.trim();
  if (!content) {
    setStatus("Write a message first.");
    return;
  }

  socket.emit("chat:message:send", {
    channelId: currentChannel._id,
    userId: currentUserId,
    content,
  }, (response) => {
    if (response?.error) {
      setStatus(response.error);
      return;
    }

    els.messageInput.value = "";
    setStatus(response.message || "Message sent");
  });
};

const markRead = () => {
  if (!currentChannel) return;

  socket.emit("chat:channel:read", {
    channelId: currentChannel._id,
    userId: currentUserId,
  });
};

const createChannel = async () => {
  const name = els.channelName.value.trim();
  const description = els.channelDescription.value.trim();

  if (!name || !currentUserId) {
    setStatus("Provide a user id and channel name first.");
    return;
  }

  const data = await api("/api/v1/chat/channels", {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
      createdBy: currentUserId,
      isPrivate: false,
    }),
  });

  setStatus(data.message || "Channel created");
  await loadChannels();
  await joinChannel(data.channel._id);
};

const connectSocket = () => {
  if (socket) {
    socket.disconnect();
  }

  socket = io();
  setSocketState("Connecting...");

  socket.on("connect", () => setSocketState(`Connected: ${socket.id}`));
  socket.on("disconnect", () => setSocketState("Disconnected"));

  socket.on("chat:message:new", (payload) => {
    if (payload?.data?.channel?._id === currentChannel?._id) {
      currentMessages.push(payload.data);
      renderMessages();
    }
  });

  socket.on("chat:message:updated", (payload) => {
    const updated = payload?.data;
    if (!updated) return;
    currentMessages = currentMessages.map((message) =>
      String(message._id) === String(updated._id) ? updated : message
    );
    renderMessages();
  });

  socket.on("chat:message:deleted", (payload) => {
    const deletedId = payload?.data?.messageId;
    currentMessages = currentMessages.filter((message) => String(message._id) !== String(deletedId));
    renderMessages();
  });

  socket.on("chat:channel:read-updated", async () => {
    if (currentChannel) {
      await loadMembers(currentChannel._id);
    }
  });
};

els.connectBtn.addEventListener("click", async () => {
  currentUserId = els.userId.value.trim();
  if (!currentUserId) {
    setStatus("Enter a user id first.");
    return;
  }

  connectSocket();
  setStatus("Socket connection requested.");
  await loadChannels();
});

els.loadChannelsBtn.addEventListener("click", loadChannels);
els.createChannelBtn.addEventListener("click", createChannel);
els.sendBtn.addEventListener("click", sendMessage);
els.markReadBtn.addEventListener("click", markRead);

window.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    sendMessage();
  }
});

