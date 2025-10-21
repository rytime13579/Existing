import {create} from 'zustand';
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";
import {useAuthStore} from "./useAuthStore";



export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    
    setActiveTab: (tab) => set({activeTab:tab}),
    setSelectedUser: (selectedUser) => set({selectedUser}),

    getAllContacts: async() => {
        set ({ isUsersLoading: true});
        try {
            // get all contacts from the back end using an api rquests
            const res = await axiosInstance.get("/messages/contacts");
            console.log(res.data);
            set ({ allContacts: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in get all contacts", error);
        } finally {
            set({ isUsersLoading: false});
        }   
    },
    getMyChatPartners: async() => {
        set ({isUsersLoading: true});
        try {
            // get all chat partners from back end api
            const res = await axiosInstance.get("/messages/chats");
            set ({chats: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in get chat partners", error);
        } finally {
            set ({ isUsersLoading: false});
        }
    },
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
            };
        // immidetaly update the ui by adding the message
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: messages.concat(res.data) });
        } catch (error) {
        // remove optimistic message on failure
            set({ messages: messages });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    subscribeToMessages : () => {
        const {selectedUser} = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const currentMessages = get().messages;
            set({messages: [...currentMessages, newMessage]});
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }

}));