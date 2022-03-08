import { useAuth } from "hooks/AuthHook";
import Profile from "./Profile";

const Navbar: React.FC = () => {
    const { isLoggedIn, login, logout } = useAuth();
    
    return (
        <div className="flex justify-between items-center p-2 shadow-lg">
            <div className="font-sans text-xl">
                GTasks
            </div>

            {isLoggedIn ? (
                <Profile />
            ) : (
                <button
                    className="bg-blue-600 px-4 py-1 rounded text-neutral-100 drop-shadow-xl"
                    onClick={login}
                >
                    Login
                </button>
            )}
        </div>
    );
};

export default Navbar;
