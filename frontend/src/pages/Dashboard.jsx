
import { Link } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    Ticket,
    User
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {

    const { user } = useAuth();

    return (
        <div className="dashboard-page">

            <div className="dashboard-heading">
                <span className="small-label">
                    STUDENT PORTAL
                </span>

                <h1>
                    Welcome, {user?.name}!
                </h1>

                <p>
                    Explore upcoming campus events
                    and manage your account.
                </p>
            </div>


            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <CalendarDays size={30} />

                    <h3>Explore Events</h3>

                    <p>
                        Discover upcoming college festivals,
                        workshops and competitions.
                    </p>

                    <Link to="/">
                        Browse Events
                    </Link>
                </div>


                <div className="dashboard-card">
                    <Ticket size={30} />

                    <h3>My Tickets</h3>

                    <p>
                        Your registered event tickets
                        will appear here.
                    </p>

                    <span className="coming-soon">
                        Coming Soon
                    </span>
                </div>


                <div className="dashboard-card">
                    <User size={30} />

                    <h3>My Profile</h3>

                    <p>
                        View your account information.
                    </p>

                    <span className="profile-email">
                        {user?.email}
                    </span>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
