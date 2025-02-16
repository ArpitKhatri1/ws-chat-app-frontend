import { useEffect, useState, useRef } from "react";
import { Copy } from 'lucide-react';
import { generateRoomCode } from "../lib/generateRoomCode";
import useWebSocketStore from "../store/websocket-store";

import ChatBox from "../components/chatbox";
function Home() {
    let userNameRefUnmount = useRef("")
    let [roomCode, setRoomCode] = useState("");
    const [copied, setCopied] = useState(false);
    const setWebSocket = useWebSocketStore((store) => store.setWebSocket)
    const socket = useWebSocketStore((store) => store.ws)
    const userNameRef = useRef<HTMLInputElement>(null);
    const roomCodeRef = useRef<HTMLInputElement>(null);
    const setRoomId = useWebSocketStore((store) => store.setRoomId);
    const chatBoxRef = useRef<HTMLInputElement>(null)

    let [roomJoin, setRoomJoined] = useState(false);

    function createSocketConnection() {
        const socket = new WebSocket(import.meta.env.VITE_BACKEND_URL)
        setWebSocket(socket)
        return socket;

    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);

    };

    const handleGenerateRoomCode = () => {
        const newRoomCode = generateRoomCode();
        setRoomCode(newRoomCode);
        const payload = {
            type: "CREATE",
            payload: {
                roomId: newRoomCode,
            },
        };
        socket?.send(JSON.stringify(payload));

    };
    const joinRoom = () => {
        if (!userNameRef.current || !roomCodeRef.current) {
            return
        }
        let username = userNameRef.current.value
        userNameRefUnmount.current = userNameRef.current.value
        let roomId = roomCodeRef.current.value

        if (!username || !roomId) {
            return
            //toast
        }
        setRoomId(roomId);
        const payload = {
            type: "JOIN",
            payload: {
                user: username,
                roomId: roomId
            }

        }
        setRoomJoined(true);

        socket?.send(JSON.stringify(payload))

    }

    useEffect(() => {
        const socket = createSocketConnection();
        setWebSocket(socket);

        return () => {
            console.log("close request")
            socket.close()
        }
    }, []);

    // new page

    type receivedMessage = {
        msgString: string,
        userName: string
    }

    const [messages, setMessages] = useState<receivedMessage[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const roomId = useWebSocketStore((store) => store.roomId)

    const handleKeyDown = (event: React.KeyboardEvent) => {

        if (event.key === "Enter") {
            if (userNameRefUnmount.current === "") {
                return
            }
            let username = userNameRefUnmount.current

            if (!inputRef.current) {
                return
            }

            const msgString = inputRef.current.value

            const payload = {
                type: "MESSAGE",
                payload: {
                    roomId: roomId,
                    msgString: msgString,
                    userName: username
                }
            }
            console.log(payload)
            socket?.send(JSON.stringify(payload))
            inputRef.current.value = ""
        }

    }

    const handleSendMessage = () => {

        if (userNameRefUnmount.current === "") {
            return
        }
        let username = userNameRefUnmount.current

        if (!inputRef.current) {
            return
        }

        const msgString = inputRef.current.value

        if (msgString === "") {
            return;
        }

        const payload = {
            type: "MESSAGE",
            payload: {
                roomId: roomId,
                msgString: msgString,
                userName: username
            }
        }
        console.log(payload)
        socket?.send(JSON.stringify(payload))
        inputRef.current.value = ""

    }

    if (socket) {
        socket.onmessage = (event) => {
            console.log("meesage recienved", event.data)
            const data = JSON.parse(event.data)
            setMessages((prev) => ([...prev, { msgString: data.msgString, userName: data.userName }]))

        }
    } else {
        console.log("no socket")
    }

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
        }
    }, [messages])

    return roomJoin ? (
        <div className="bg-black text-white w-screen min-h-screen flex items-center justify-center">
            <div className="w-[40%] min-w-[350px] h-fit border-solid border-white border-[1px] rounded-xl space-y-3 px-5 pb-10">
                <div className="py-5">
                    <div className="text-3xl">Real Time Chat</div>
                    <div className="text-slate-500">Rooms get deleted after all users exit</div>
                </div>
                <div className="bg-neutral-800 flex  gap-3 justify-center items-center py-5 text-sm px-5 rounded-xl">
                    <div>RoomCode: {roomId}</div>
                </div>
                <div ref={chatBoxRef} className="h-[380px] border-solid border-neutral-500 border-[1px] overflow-y-scroll overflow-x-hidden rounded-lg mt-10 pb-3">
                    <ChatBox messages={messages} userName={userNameRefUnmount.current} />
                </div>
                <div className="grid grid-cols-5 w-full grid-row-1 mt-8 mb-5">
                    <input
                        ref={inputRef}
                        type="text"
                        className="rounded p-2 col-span-4 w-full border-solid border-neutral-600 border-[1px]"
                        placeholder="Type a message..."
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleSendMessage} className="col-span-1 bg-white text-black rounded w-full ml-2">
                        Send
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <div className="bg-black text-white w-screen min-h-screen flex items-center justify-center">
            <div className="w-[40%] min-w-[350px] h-fit border-solid border-white border-[1px] rounded-xl space-y-3 px-5 pb-10">
                <div className="py-5">
                    <div className="text-3xl">Real Time Chat</div>
                    <div className="text-slate-500">Rooms get deleted after all users exit</div>
                </div>
                <div>
                    <button className="px-10 py-3 bg-white text-black rounded w-full" onClick={handleGenerateRoomCode}>
                        Create New Room
                    </button>
                </div>
                <div className="space-y-5">
                    <input
                        ref={userNameRef}
                        type="text"
                        className="rounded w-full p-2 border-solid border-slate-600 border-[1px]"
                        placeholder="Enter Your Name"
                    />
                    <div className="grid grid-cols-5 w-full grid-row-1">
                        <input
                            ref={roomCodeRef}
                            type="text"
                            className="rounded p-2 col-span-4 w-full border-solid border-slate-600 border-[1px]"
                            placeholder="Enter Room Code"
                        />
                        <button className="col-span-1 bg-white text-black rounded w-full ml-1" onClick={joinRoom}>
                            Join Room
                        </button>
                    </div>
                </div>
                {roomCode && (
                    <div className="bg-neutral-600 flex flex-col gap-3 justify-center items-center py-7 text-sm px-10">
                        <div>Share this with your friend or open in another browser</div>
                        <div className="text-3xl font-bold flex items-center gap-3">
                            {roomCode}
                            <Copy onClick={handleCopyCode} className="cursor-pointer" />
                            {copied && <span className="text-green-400 text-sm">Copied!</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default Home;

