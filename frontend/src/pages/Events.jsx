
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import api from "../services/api";

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get("/events");

                setEvents(
                    (response.data.events || []).filter(
                        event =>
                            event.status === "upcoming" &&
                            new Date(event.date) > new Date()
                    )
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load events."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <p className="page-message">Loading events...</p>;
    }

    if (error) {
        return <p className="page-error">{error}</p>;
    }

    return (
        <main className="student-events-page">
            <div className="student-page-heading">
                <span className="small-label">DISCOVER PASSENTRY</span>
                <h1>Explore Events</h1>
                <p>Find events, reserve your seats and make memories.</p>
            </div>

            {events.length === 0 ? (
                <div className="empty-events">
                    <Ticket size={40} />
                    <h3>No upcoming events</h3>
                    <p>Please check again later for new events.</p>
                </div>
            ) : (
                <div className="student-event-grid">
                    {events.map(event => (
                        <article className="student-event-card" key={event._id}>
                            {event.poster ? (
                                <img
                                    src={`${SERVER_URL}${event.poster}`}
                                    alt={event.title}
                                    className="student-event-image"
                                />
                            ) : (
                                <div className="student-event-placeholder">
                                    <Ticket size={40} />
                                </div>
                            )}

                            <div className="student-event-content">
                                <span className="event-category">
                                    {event.category}
                                </span>

                                <h2>{event.title}</h2>

                                <p>{event.description}</p>

                                <div className="student-event-meta">
                                    <span>
                                        <CalendarDays size={16} />
                                        {new Date(event.date).toLocaleDateString("en-IN")}
                                    </span>

                                    <span>
                                        <MapPin size={16} />
                                        {event.venue}
                                    </span>
                                </div>

                                <div className="student-event-footer">
                                    <div>
                                        <strong>₹{event.price}</strong>
                                        <small>
                                            {event.availableSeats} seats available
                                        </small>
                                    </div>

                                    <Link
                                        to={`/events/${event._id}`}
                                        className="view-event-btn"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
};

export default Events;
