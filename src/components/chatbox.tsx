type receivedMessage = {
    msgString: string,
    userName: string
}

import { cn } from "../lib/cn"

type ChatBoxProps = {
    messages: receivedMessage[], userName: string
}

function ChatBox({ messages, userName }: ChatBoxProps) {
    console.log(userName)
    return (
        <div className="text-sm md:text-md w-full h-full  px-3 py-2 text-white flex flex-col gap-1">
            {
                messages.map((message, key) => {

                    const isSameSender = key > 0 && messages[key - 1].userName === message.userName
                    const isSameUser = message.userName === userName
                    return (
                        <div key={key} >
                            {!isSameSender && <div className={cn("text-sm  text-muted text-neutral-400 ml-auto", isSameUser ? "text-right" : "text-left")}>From: {message.userName}</div>}
                            <div className={cn("bg-white p-2 text-black w-fit  rounded max-w-[400px] mb-1", isSameUser ? "ml-auto" : "mr-auto")}>
                                {message.msgString}

                            </div>

                        </div>
                    )
                })
            }

        </div>
    )
}
export default ChatBox

