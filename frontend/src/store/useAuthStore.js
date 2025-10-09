import {create} from 'zustand';

// TODO probably delete this

export const useAuthStore = create((set) => ({
    authUser: {name:"John", _id:123, age:25},
    isLoggedIn: false,

    login: () => {
        console.log("We just logged in");
        set({isLoggedIn:true});
    }
    
}))

