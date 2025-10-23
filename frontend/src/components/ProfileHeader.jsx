import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, LoaderIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { downscaleImage } from '../util/downscaleImage';
import toast from 'react-hot-toast';

function ProfileHeader() {
    const { logout, authUser, updateProfile, isUploadingImage } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);

    const fileInputRef = useRef(null); // get file input for profile picture


    const handleImageUpload = async (e) => { // handle uploading the image
        const file = e.target.files[0];
        if (!file) return;
        // code was changed here to allow for image downscaling
        try {
            const small = await downscaleImage(file, 512, 512, "image/webp", 0.82);
            setSelectedImg(small);
            await updateProfile({ profilePic: small });
        } catch (error) {
            console.log("Image processing failed: " , error);
            toast.error("Could not process image. Try a smaller file");
        }

        // const reader = new FileReader();
        // reader.readAsDataURL(file);

        // reader.onloadend = async () => {
        //     const base64Image = reader.result;
        //     setSelectedImg(base64Image);
        //     await updateProfile({ profilePic: base64Image });
        // };
    };

    return (
    <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            {/* AVATAR */}
            <div className="avatar online">
                <button
                className="size-14 rounded-full overflow-hidden relative group"
                onClick={() => fileInputRef.current.click()}
                >
                {isUploadingImage ? (
                    <LoaderIcon className="mx-auto h-5 w-5 animate-spin" />
                ) : (
                    <img
                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                    alt="User image"
                    className="size-full object-cover"
                />
                )

                }
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs">Change</span>
                </div>
                </button>

                <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                />
            </div>

            {/* USERNAME & ONLINE TEXT */}
            <div>
                <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
                {authUser.fullName}
                </h3>

                <p className="text-slate-400 text-xs">Online</p>
            </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 items-center">
            {/* LOGOUT BTN */}
            <button
                className="text-slate-400 hover:text-slate-200 transition-colors"
                onClick={logout}
            >
                <LogOutIcon className="size-5" />
            </button>
            </div>
        </div>
    </div>
    );
}
export default ProfileHeader;