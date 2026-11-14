
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    registerUser,
    loginUser,
    getCurrentUser
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // Restore login after refreshing the page
    useEffect(() => {

        const token = localStorage.getItem("passentry_token");

        if (!token) {
            setLoading(false);
            return;
        }

        const restoreSession = async () => {
            try {
                const response = await getCurrentUser();

                setUser(response.user);

            } catch (error) {
                localStorage.removeItem("passentry_token");
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        restoreSession();

    }, []);


    // Login
    const login = async (credentials) => {

        const response = await loginUser(credentials);

        localStorage.setItem(
            "passentry_token",
            response.token
        );

        setUser(response.user);

        return response.user;
    };


    // Register
    const register = async (userData) => {

        const response = await registerUser(userData);

        localStorage.setItem(
            "passentry_token",
            response.token
        );

        setUser(response.user);

        return response.user;
    };


    // Logout
    const logout = () => {

        localStorage.removeItem("passentry_token");

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


// Custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};
