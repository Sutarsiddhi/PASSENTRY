
import { Link, useNavigate } from "react-router-dom";
import { Ticket, LogOut, LayoutDashboard } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar">

            <Link to="/" className="brand">
                <Ticket size={25} />
                PASSENTRY
            </Link>

            <div className="nav-links">

                <Link to="/">Home</Link>

                {user ? (
                    <>
                        <Link to="/dashboard">
                            <LayoutDashboard size={17} />
                            Dashboard
                        </Link>

                        <span className="nav-user">
                            Hi, {user.name}
                        </span>

                        <Link to="/events">
                            Explore Events
                        </Link>

                        <Link to="/my-bookings">
                            My Bookings
                        </Link>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            <LogOut size={17} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>

                        <Link
                            to="/register"
                            className="nav-register"
                        >
                            Register
                        </Link>
                    </>
                )}

            </div>
        </nav>
    );
};

export default Navbar;
