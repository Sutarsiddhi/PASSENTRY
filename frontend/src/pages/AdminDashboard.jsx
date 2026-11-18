
import { useEffect, useState } from "react";

import {
    CalendarDays,
    CalendarPlus,
    Users,
    Ticket,
    Pencil,
    Trash2,
    RefreshCw
} from "lucide-react";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

import EventForm from "../components/EventForm";


const SERVER_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";


const AdminDashboard = () => {

    const { user } = useAuth();

    const [events, setEvents] = useState([]);

    const [stats, setStats] = useState({
        totalEvents: 0,
        upcomingEvents: 0,
        totalCapacity: 0,
        availableSeats: 0,
        bookedSeats: 0
    });

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);


    // Load events and dashboard statistics
    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const [eventResponse, statsResponse] =
                await Promise.all([

                    api.get("/events"),

                    api.get("/events/stats")

                ]);

            setEvents(eventResponse.data.events || []);

            setStats(statsResponse.data.stats);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load admin dashboard."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchDashboardData();

    }, []);


    // Open create form
    const handleCreate = () => {

        setSelectedEvent(null);

        setShowForm(true);

        setError("");

        setSuccess("");
    };


    // Open edit form
    const handleEdit = (event) => {

        setSelectedEvent(event);

        setShowForm(true);

        setError("");

        setSuccess("");
    };


    // Close form
    const handleCancel = () => {

        setShowForm(false);

        setSelectedEvent(null);
    };


    // Create or update event
    const handleSaveEvent = async (formData) => {

        try {

            setSubmitting(true);

            setError("");

            setSuccess("");

            if (selectedEvent) {

                await api.put(
                    `/events/${selectedEvent._id}`,
                    formData
                );

                setSuccess("Event updated successfully!");

            } else {

                await api.post(
                    "/events",
                    formData
                );

                setSuccess("Event created successfully!");
            }


            setShowForm(false);

            setSelectedEvent(null);

            await fetchDashboardData();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to save event. Please try again."
            );

        } finally {

            setSubmitting(false);
        }
    };


    // Delete event
    const handleDelete = async (eventId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            setSuccess("");

            await api.delete(`/events/${eventId}`);

            setSuccess("Event deleted successfully!");

            await fetchDashboardData();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to delete event."
            );
        }
    };


    return (

        <div className="admin-page">

            {/* Dashboard heading */}
            <div className="admin-heading">

                <div>

                    <span className="small-label">
                        PASSENTRY ADMIN PANEL
                    </span>

                    <h1>
                        Welcome, {user?.name}!
                    </h1>

                    <p>
                        Manage your events and monitor
                        ticket availability.
                    </p>

                </div>


                <button
                    className="create-event-btn"
                    onClick={handleCreate}
                >
                    <CalendarPlus size={19} />

                    Create Event
                </button>

            </div>


            {/* Messages */}
            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="admin-success">
                    {success}
                </div>
            )}


            {/* Event form */}
            {showForm && (

                <EventForm
                    event={selectedEvent}
                    onSubmit={handleSaveEvent}
                    onCancel={handleCancel}
                    submitting={submitting}
                />

            )}


            {/* Dashboard statistics */}
            <section className="admin-stats">

                <div className="stat-card">

                    <div className="stat-icon purple">
                        <CalendarDays size={24} />
                    </div>

                    <div>
                        <span>Total Events</span>

                        <h2>{stats.totalEvents}</h2>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon green">
                        <CalendarPlus size={24} />
                    </div>

                    <div>
                        <span>Upcoming Events</span>

                        <h2>{stats.upcomingEvents}</h2>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon orange">
                        <Users size={24} />
                    </div>

                    <div>
                        <span>Total Capacity</span>

                        <h2>{stats.totalCapacity}</h2>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon blue">
                        <Ticket size={24} />
                    </div>

                    <div>
                        <span>Available Seats</span>

                        <h2>{stats.availableSeats}</h2>
                    </div>

                </div>

            </section>


            {/* Event management */}
            <section className="admin-events">

                <div className="admin-section-heading">

                    <div>
                        <h2>Manage Events</h2>

                        <p>
                            View and manage all created events.
                        </p>
                    </div>

                    <button
                        className="refresh-btn"
                        onClick={fetchDashboardData}
                        disabled={loading}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

                </div>


                {loading ? (

                    <p className="admin-loading">
                        Loading events...
                    </p>

                ) : events.length === 0 ? (

                    <div className="empty-events">

                        <CalendarDays size={40} />

                        <h3>No Events Created Yet</h3>

                        <p>
                            Start by creating your first PASSENTRY event.
                        </p>

                        <button
                            className="create-event-btn"
                            onClick={handleCreate}
                        >
                            Create Your First Event
                        </button>

                    </div>

                ) : (

                    <div className="admin-event-grid">

                        {events.map((event) => (

                            <div
                                className="admin-event-card"
                                key={event._id}
                            >

                                {event.poster ? (

                                    <img
                                        src={`${SERVER_URL}${event.poster}`}
                                        alt={event.title}
                                        className="admin-event-image"
                                    />

                                ) : (

                                    <div className="event-image-placeholder">
                                        <Ticket size={38} />
                                        <span>PASSENTRY EVENT</span>
                                    </div>

                                )}


                                <div className="admin-event-content">

                                    <div className="event-title-row">

                                        <span className="event-category">
                                            {event.category}
                                        </span>

                                        <span
                                            className={`status-badge ${event.status}`}
                                        >
                                            {event.status}
                                        </span>

                                    </div>


                                    <h3>{event.title}</h3>

                                    <p className="event-description">
                                        {event.description}
                                    </p>


                                    <div className="admin-event-info">

                                        <span>
                                            <CalendarDays size={15} />

                                            {new Date(
                                                event.date
                                            ).toLocaleDateString("en-IN")}
                                        </span>

                                        <span>
                                            {event.venue}
                                        </span>

                                        <span>
                                            ₹{event.price}
                                        </span>

                                        <span>
                                            {event.availableSeats} /
                                            {event.capacity} seats available
                                        </span>

                                    </div>


                                    <div className="event-action-buttons">

                                        <button
                                            className="edit-event-btn"
                                            onClick={() => handleEdit(event)}
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </button>


                                        <button
                                            className="delete-event-btn"
                                            onClick={() => handleDelete(event._id)}
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
};

export default AdminDashboard;
