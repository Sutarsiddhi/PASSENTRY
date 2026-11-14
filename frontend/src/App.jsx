
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";


const AppRoutes = () => {

    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-screen">Loading PASSENTRY...</div>;
    }

    return (
        <>
            <Navbar />

            <Routes>

                {/* Public pages */}
                <Route path="/" element={<Home />} />

                <Route
                    path="/login"
                    element={
                        user
                            ? <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
                            : <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        user
                            ? <Navigate to="/dashboard" replace />
                            : <Register />
                    }
                />


                {/* Protected student and admin dashboard */}
                <Route element={<ProtectedRoute allowedRoles={["student", "admin"]} />}>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />
                </Route>


                {/* Admin-only dashboard */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />
                </Route>


                {/* Unknown routes */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </>
    );
};


const App = () => {

    return (
        <BrowserRouter>

            <AuthProvider>
                <AppRoutes />
            </AuthProvider>

        </BrowserRouter>
    );
};

export default App;
