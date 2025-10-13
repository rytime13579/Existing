import {create} from 'zustand';
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";
// using zustand we create a store where we can interact with the backend api
// then using the create method we create a store and pass it set for the name of the 
// variable that will be used to set our return variable for the rest of the front end

// axios is used to handle the get, post, put, etc requests
export const useAuthStore = create((set) => ({
    
    authuser: null, 
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    
    // check for authentication from api using axios and zustand
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set ({authUser: res.data});
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
        } catch (error) {
            toast.error("Error logging out");
            console.log("Error in logout", error);
        }
    }

}))


