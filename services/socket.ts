let socket: WebSocket | null = null;

export const connectSocket = (userId: string) => {
  // 👇 change to your actual Render backend domain
  const WS_URL = `wss://soceyo.onrender.com/ws/${userId}`;

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("✅ Connected to WebSocket server");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("📩 New message from socket:", data);
  };

  socket.onclose = () => {
    console.log("❌ WebSocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("⚠️ WebSocket error:", error);
  };

  return socket;
};

export const sendSocketMessage = (message: string) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.warn("Socket is not open. Cannot send message.");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.close();
  }
};
