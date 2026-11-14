
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { user } = useAuth();

    useEffect(() => {

        const fetchEvents = async () => {
            try {
                const response = await api.get("/events");

                setEvents(response.data.events || []);

            } catch (error) {
                setError("Unable to load events. Please try again.");

            } finally {
                setLoading(false);
            }
        };

        fetchEvents();

    }, []);


    return (
        <div>

            <section className="hero">

                <div className="hero-content">

                    <span className="hero-tag">
                        YOUR CAMPUS. YOUR EVENTS.
                    </span>

                    <h1>
                        Discover Events.
                        <br />
                        Book Your <span>Tickets.</span>
                    </h1>

                    <p>
                        Explore college festivals, workshops,
                        competitions and exciting campus events
                        with PASSENTRY.
                    </p>

                    <Link
                        to={user ? "/dashboard" : "/register"}
                        className="primary-btn"
                    >
                        {user ? "Go to Dashboard" : "Get Started"}
                    </Link>

                </div>

            </section>


            <section className="events-section">

                <div className="section-heading">
                    <div>
                        <span className="small-label">
                            EXPLORE
                        </span>

                        <h2>Upcoming Events</h2>
                    </div>
                </div>


                {loading && (
                    <p className="info-message">
                        Loading events...
                    </p>
                )}

                {error && (
                    <p className="error-message">{error}</p>
                )}

                {!loading && !error && events.length === 0 && (
                    <p className="info-message">
                        No events available at the moment.
                    </p>
                )}


                <div className="event-grid">

                    {events.map((event) => (

                        <div
                            className="event-card"
                            key={event._id}
                        >

                            <div className="event-card-top">
                                <Ticket size={25} />
                                <span>{event.category}</span>
                            </div>

                            <h3>{event.title}</h3>

                            <p>{event.description}</p>

                            <div className="event-details">

                                <span>
                                    <CalendarDays size={16} />
                                    {new Date(event.date).toLocaleDateString("en-IN")}
                                </span>

                                <span>
                                    <MapPin size={16} />
                                    {event.venue}
                                </span>

                            </div>

                            <div className="event-bottom">

                                <strong>
                                    {Number(event.price) === 0
                                        ? "Free"
                                        : `₹${event.price}`}
                                </strong>

                                <span>
                                    {event.availableSeats} seats left
                                </span>

                            </div>

                            <Link
                                to={user ? "/dashboard" : "/login"}
                                className="event-btn"
                            >
                                View Event
                            </Link>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    );
};

export default Home;
