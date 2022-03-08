import React, { useEffect } from "react";
import { useAuth } from "hooks/AuthHook";
import { Navigate } from "react-router-dom";

const OAuthRedirect: React.FC = () => {
    const { getAccessToken, isLoggedIn, isLoading, isError } = useAuth();

    useEffect(getAccessToken, []);
    
    if(isLoggedIn) return <Navigate to="/profile" />;
    if (isLoading) return <div>Retrieving access token</div>;
    if (isError) return <div>Error occured. Login Again</div>;

    return <div>OAuth Redirect Page</div>;

};

export default OAuthRedirect;
