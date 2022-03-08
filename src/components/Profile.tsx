import { useAuth } from "hooks/AuthHook";
import { useEffect } from "react";

function LoadingProfile() {
    return (
        <div className="flex items-center animate-pulse space-x-3">
            <div className="rounded-full h-10 w-10 bg-gray-300"></div>
            <div className="rounded h-5 bg-gray-300 w-40"></div>
        </div>
    );
}

function Profile() {
    const { profile, logout } = useAuth();

    return (
        <div>
            {profile === undefined ? (
                <LoadingProfile />
            ) : (
                <div className="flex items-center space-x-3">
                    <img
                        src={profile.picture}
                        className="rounded-full h-8 w-8"
                        alt="profile picture"
                    />
                    <div className="rounded h-5">{profile.name}</div>
                    <button
                        className="bg-blue-600 px-4 py-1 rounded text-neutral-100 drop-shadow-xl"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default Profile;
