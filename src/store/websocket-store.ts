import { create } from "zustand";

type websocketStoreType = {
  roomId: string;
  ws: WebSocket | null;
  setWebSocket: (socket: WebSocket) => void;
  setRoomId: (roomId: string) => void;
};

const useWebSocketStore = create<websocketStoreType>((set) => ({
  ws: null,
  roomId: "",
  setWebSocket: (socket) => set({ ws: socket }),
  setRoomId: (roomId) =>
    set({
      roomId: roomId,
    }),
}));
export default useWebSocketStore;
