/**
 * services/socket.ts
 * WebSocket connector for chat conversations.
 *
 * Reads socket base URL from NEXT_PUBLIC_SOCKET_URL in .env.
 * Example:
 *   NEXT_PUBLIC_SOCKET_URL=ws://127.0.0.1:8000
 *   or
 *   NEXT_PUBLIC_SOCKET_URL=wss://soceyo.onrender.com
 */

let socket: WebSocket | null = null;

// ✅ Connect to a specific conversation
export const connectSocket = (conversationId: string): WebSocket => {
  const baseUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/$/, "") ||
    "ws://127.0.0.1:8000";

  const WS_URL = `${baseUrl}/ws/conversations/${conversationId}`;

  // Close any existing socket first
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log(`✅ Connected → ${WS_URL}`);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.warn("⚠️ WebSocket reported error:", data.error);
        return;
      }
      console.log("📩 Incoming message:", data);
    } catch (err) {
      console.error("⚠️ WebSocket JSON parse error:", err);
    }
  };

  socket.onclose = (event) => {
    console.log(`❌ WebSocket closed (${conversationId}) →`, event.reason || "");
  };

  socket.onerror = (err) => {
    console.error("⚠️ WebSocket error:", err);
  };

  return socket;
};

// ✅ Send a structured message (auto‑JSON)
export const sendSocketMessage = (payload: {
  sender_id: string;
  content?: string;
  file_ids?: string[];
}) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  } else {
    console.warn("⚠️ Socket not open. Cannot send message yet.");
  }
};

// ✅ Disconnect current conversation socket
export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};