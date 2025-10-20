import {create} from 'zustand';
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

// using zustand we create a store where we can interact with the backend api
// then using the create method we create a store and pass it set for the name of the 
// variable that will be used to set our return variable for the rest of the front end

// axios is used to handle the get, post, put, etc requests
export const useAuthStore = create((set, get) => ({
    
    authUser: null, 
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUploadingImage: false,
    socket: null,
    onlineUsers: [],
    
    // check for authentication from api using axios and zustand
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set ({authUser: res.data});
            console.log();
            get().connectSocket();
        } catch (error) {
            
            console.log("Error in auth check", error);
            set({authUser:null});

        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async(data) => {
        set({isSigningUp:true})
        try { 
            const res = await axiosInstance.post('/auth/signup', data);
            set ({authUser: res.data}); // get user data from api and send it to auth user object
            // send success message
            toast.success("Account created successfully!");
            get().connectSocket();
        } catch (error) {
            // send notifaction error
            toast.error(error.response.data.message);
            console.log("error in singup", error);
        } finally {
            set({isSigningUp:false})
        }
    },
    
    login: async(data) => {
        set({isLogginIn:true})
        try { 
            const res = await axiosInstance.post('/auth/login', data);
            set ({authUser: res.data}); // get user data from api and send it to auth user object
            // send success message
            toast.success("Logged In successfully!");
            get().connectSocket();
        } catch (error) {
            // send notifaction error
            toast.error(error.response.data.message);
            console.log("error in login", error);
        } finally {
            set({isLoggingIn:false})
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post('/auth/logout');
            set ({authUser: null});
            toast.success("Logged Out successfully!");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error logging out");
            console.log("Error in logout", error);
        }
    }, 
    updateProfile: async (data) => {
        set({isUploadingImage: true});
        console.log(data);
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set(({isUploadingImage: false}));
        }
    },    

    connectSocket: () => {
        const {authUser} = get();
        console.log(authUser);
        if (!authUser || get().socket?.connected) {
            console.log("socket connection failed");
            return;
        }
        const socket = io(BASE_URL, {
            withCredentials:true // ensures cookies are sent with the connection
        });
    
        socket.connect();
        set({socket});
        // listen for online users event

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();

    }

}))


