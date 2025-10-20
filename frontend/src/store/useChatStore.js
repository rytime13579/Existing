import {create} from 'zustand';
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set) => ({
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
    

}));