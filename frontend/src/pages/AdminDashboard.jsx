
import { Link } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarPlus,
    Users,
    Ticket
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {

    const { user } = useAuth();

    return (
        <div className="dashboard-page">

            <div className="dashboard-heading">

                <span className="small-label">
                    ADMIN PORTAL
                </span>

                <h1>
                    Welcome, {user?.name}!
                </h1>

                <p>
                    Manage PASSENTRY events and
                    monitor student registrations.
                </p>

            </div>


            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <CalendarPlus size={30} />

                    <h3>Manage Events</h3>

                    <p>
                        Create and manage college events.
                    </p>

                    <span className="coming-soon">
                        Event management UI coming soon
                    </span>
                </div>


                <div className="dashboard-card">
                    <Users size={30} />

                    <h3>Registrations</h3>

                    <p>
                        Monitor student event registrations.
                    </p>

                    <span className="coming-soon">
                        Coming Soon
                    </span>
                </div>


                <div className="dashboard-card">
                    <Ticket size={30} />

                    <h3>Ticket Verification</h3>

                    <p>
                        Verify student tickets and QR codes.
                    </p>

                    <span className="coming-soon">
                        Coming Soon
                    </span>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;
