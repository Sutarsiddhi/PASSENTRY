
import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [serverStatus, setServerStatus] = useState(
        "Connecting to backend..."
    );

    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/events")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }

                return response.json();
            })
            .then((data) => {
                setEvents(data.events);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        fetch("http://localhost:5000/api/status")
            .then((response) => response.json())
            .then((data) => {
                setServerStatus(data.status);
            })
            .catch(() => {
                setServerStatus("Backend connection failed!");
            });
    }, []);

    return (
        <div className="app">

            <nav className="navbar">
                <h2>PASSENTRY<span>.</span></h2>

                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="#events">Events</a>
                    <button className="login-btn">
                        Login
                    </button>
                </div>
            </nav>

            <section className="hero">
                <p className="tagline">
                    YOUR FEST. YOUR MOMENT.
                </p>

                <h1>
                    Every Great Fest
                    <br />
                    Starts With a <span>Ticket.</span>
                </h1>

                <p>
                    Discover college festivals, explore exciting
                    events and book your tickets with PASSENTRY.
                </p>

                <a href="#events" className="explore-btn">
                    Explore Events
                </a>
            </section>

            <section className="events-section" id="events">
                <h2>Explore Upcoming Events</h2>

                <div className="event-container">

                    {events.length > 0 ? (
                        events.map((event) => (
                            <div className="event-card" key={event._id}>

                                <h3>{event.title}</h3>

                                <p>{event.description}</p>

                                <div className="event-info">
                                    <span>₹{event.price}</span>
                                    <span>{event.availableSeats} Seats Left</span>
                                </div>

                                <p>
                                    Venue: {event.venue}
                                </p>

                                <p>
                                    Date: {new Date(event.date).toLocaleDateString("en-IN")}
                                </p>

                                <button className="book-btn">
                                    View Event
                                </button>

                            </div>
                        ))
                    ) : (
                        <p>Loading events...</p>
                    )}

                </div>
            </section>

            <footer>
                <p>© 2026 PASSENTRY. All rights reserved.</p>
                <p>{serverStatus}</p>
            </footer>

        </div>
    );
}

export default App;
