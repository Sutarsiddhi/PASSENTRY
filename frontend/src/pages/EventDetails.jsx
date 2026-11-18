
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import api from "../services/api";

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data.event);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load event details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        try {
            setBooking(true);
            setError("");

            const response = await api.post("/bookings", {
                eventId: id,
                quantity: Number(quantity)
            });

            alert(
                `Reservation successful! Booking reference: ${
                    response.data.booking.bookingReference
                }`
            );

            navigate("/my-bookings");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reserve tickets."
            );
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return <p className="page-message">Loading event...</p>;
    }

    if (error && !event) {
        return <p className="page-error">{error}</p>;
    }

    if (!event) {
        return <p className="page-message">Event not found.</p>;
    }

    const unavailable =
        event.status !== "upcoming" ||
        new Date(event.date) <= new Date() ||
        event.availableSeats < 1;

    const totalAmount = event.price * quantity;

    return (
        <main className="event-details-page">
            <button
                className="back-btn"
                onClick={() => navigate("/events")}
            >
                ← Back to Events
            </button>

            <div className="event-details-card">
                {event.poster && (
                    <img
                        src={`${SERVER_URL}${event.poster}`}
                        alt={event.title}
                        className="event-details-image"
                    />
                )}

                <div className="event-details-content">
                    <span className="event-category">
                        {event.category}
                    </span>

                    <h1>{event.title}</h1>

                    <p>{event.description}</p>

                    <div className="student-event-meta">
                        <span>
                            <CalendarDays size={18} />
                            {new Date(event.date).toLocaleString("en-IN")}
                        </span>

                        <span>
                            <MapPin size={18} />
                            {event.venue}
                        </span>

                        <span>
                            <Ticket size={18} />
                            {event.availableSeats} seats available
                        </span>
                    </div>

                    <div className="booking-panel">
                        <h2>Reserve Your Tickets</h2>

                        <label htmlFor="quantity">
                            Number of tickets
                        </label>

                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            max={Math.min(10, event.availableSeats)}
                            value={quantity}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setQuantity(value);
                            }}
                            disabled={unavailable}
                        />

                        <div className="booking-total">
                            <span>Price per ticket</span>
                            <strong>₹{event.price}</strong>
                        </div>

                        <div className="booking-total">
                            <span>Total amount</span>
                            <strong>₹{totalAmount}</strong>
                        </div>

                        {error && (
                            <p className="page-error">{error}</p>
                        )}

                        <button
                            className="book-ticket-btn"
                            onClick={handleBooking}
                            disabled={
                                booking ||
                                unavailable ||
                                !Number.isInteger(quantity) ||
                                quantity < 1 ||
                                quantity > 10 ||
                                quantity > event.availableSeats
                            }
                        >
                            {booking
                                ? "Reserving..."
                                : unavailable
                                    ? "Booking Unavailable"
                                    : "Reserve Tickets"}
                        </button>

                        <small>
                            This is a reservation-only step. Payment
                            integration will be added separately.
                        </small>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EventDetails;
