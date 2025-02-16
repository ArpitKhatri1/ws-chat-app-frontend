import { create } from 'zustand'

type messageStoreType = {
    message: string[],
    setMessage: (msg: string) => void
}

const useMessageStore = create<messageStoreType>((set) => ({
    message: [],
    setMessage: (msg) => set((message) => ({ message: [...message.message, msg] }))
}))

export default useMessageStore

