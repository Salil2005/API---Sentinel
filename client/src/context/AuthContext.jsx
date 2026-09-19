import { useEffect, useState } from "react";
import {
    getCurrentUser,
    loginUser,
    logoutUser,
} from "../services/auth.service";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadCurrentUser();
    }, []);

    const login = async (credentials) => {
        const response = await loginUser(credentials);
        const currentUser = await getCurrentUser();

        setUser(currentUser);

        return response;
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: Boolean(user),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};