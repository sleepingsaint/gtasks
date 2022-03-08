import axios, { AxiosInstance } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "types";

interface AuthContextInterface {
    isError: boolean;
    isLoading: boolean;
    isLoggedIn: boolean;
    profile?: UserProfile;
    checkAuthOnFirstVisit: () => void;
    login: () => void;
    logout: () => void;
    getAccessToken: () => void;
    accessToken?: string;
}

const AuthContext = createContext<AuthContextInterface>({
    isError: false,
    isLoading: false,
    isLoggedIn: false,
    checkAuthOnFirstVisit: () => {},
    login: () => {},
    logout: () => {},
    getAccessToken: () => {},
});

export const AuthContextProvider: React.FC = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [profile, setProfile] = useState<UserProfile | undefined>();
    const [accessToken, setAccessToken] = useState<string | undefined>();

    useEffect(() => {
        if (accessToken !== undefined) {
            axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then((data) => {
                    setProfile({
                        name: data.data.name,
                        picture: data.data.picture,
                    });
                })
                .catch((err) => console.log(err));
        } else {
            setProfile(undefined);
        }
    }, [accessToken]);

    // check if user is already authenticated on first visit
    const checkAuthOnFirstVisit = () => {
        const refreshToken = localStorage.getItem("gtasks_refresh_token");

        if (refreshToken !== undefined && refreshToken !== null) {
            setIsLoading(true);
            axios
                .post("http://localhost:3001/google/refreshToken", {
                    refreshToken,
                })
                .then((data) => {
                    const token = data.data;
                    setAccessToken(token.access_token);
                    setIsError(false);
                    setIsLoggedIn(true);

                    // setApi(instance);
                })
                .catch((err) => {
                    setAccessToken(undefined);
                    setIsError(true);
                    setIsLoggedIn(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    // redirect to google oauth page
    const login = () => {
        const data = {
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
            scope: "https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.profile",
            response_type: "code",
            access_type: "offline",
        };

        const queryParams = new URLSearchParams(data);
        const _url = new URL(import.meta.env.VITE_GOOGLE_AUTH_URL);

        queryParams.forEach((val, key, _) => {
            _url.searchParams.append(key, val);
        });

        window.location.href = _url.toString();
    };

    // get access token from oauth access code
    const getAccessToken = () => {
        const redirect_uri = window.location.origin + window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");

        setIsLoading(true);

        axios
            .post(import.meta.env.VITE_TOKEN_BACKEND_ENDPOINT, {
                code,
                redirect_uri,
            })
            .then((data) => {
                const token = data.data;

                localStorage.setItem(
                    "gtasks_refresh_token",
                    token.refresh_token
                );
                
                setAccessToken(token.access_token)
                setIsError(false);
                setIsLoggedIn(true);
                // console.log(token);
            })
            .catch((err) => {
                setAccessToken(undefined)
                setIsError(true);
                setIsLoggedIn(false);
            })
            .finally(() => setIsLoading(false));
    };

    // logout and clear all stored variables
    const logout = () => {
        localStorage.removeItem("gtasks_refresh_token");
        localStorage.removeItem("gtasks_expires_in");
        localStorage.removeItem("gtasks_token_type");

        setIsLoggedIn(false);
        setIsError(false);
        window.location.href = window.location.origin;
    };

    useEffect(checkAuthOnFirstVisit, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                isLoading,
                isError,
                checkAuthOnFirstVisit,
                login,
                logout,
                getAccessToken,
                profile,
                accessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const allValues = useContext(AuthContext);
    return allValues;
};
