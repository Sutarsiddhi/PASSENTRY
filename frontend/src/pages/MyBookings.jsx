
import { useEffect, useState } from "react";
import { Ticket, CalendarDays, MapPin } from "lucide-react";
import api from "../services/api";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get("/bookings/my-bookings");
                setBookings(response.data.bookings || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your bookings."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <p className="page-message">Loading your bookings...</p>;
    }

    return (
        <main className="my-bookings-page">
            <div className="student-page-heading">
                <span className="small-label">YOUR PASSENTRY ACCOUNT</span>
                <h1>My Bookings</h1>
                <p>View your event reservations and ticket details.</p>
            </div>

            {error && <p className="page-error">{error}</p>}

            {!error && bookings.length === 0 ? (
                <div className="empty-events">
                    <Ticket size={40} />
                    <h3>No bookings yet</h3>
                    <p>Explore events and reserve your first ticket.</p>
                </div>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking) => (
                        <article
                            className="booking-card"
                            key={booking._id}
                        >
                            <div className="booking-card-heading">
                                <div>
                                    <span className="small-label">
                                        BOOKING REFERENCE
                                    </span>
                                    <h3>{booking.bookingReference}</h3>
                                </div>

                                <span className={`status-badge ${booking.status}`}>
                                    {booking.status}
                                </span>
                            </div>

                            {booking.event ? (
                                <>
                                    <h2>{booking.event.title}</h2>

                                    <div className="student-event-meta">
                                        <span>
                                            <CalendarDays size={16} />
                                            {new Date(
                                                booking.event.date
                                            ).toLocaleDateString("en-IN")}
                                        </span>

                                        <span>
                                            <MapPin size={16} />
                                            {booking.event.venue}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p>Event details are no longer available.</p>
                            )}

                            <div className="booking-card-footer">
                                <span>
                                    Tickets: <strong>{booking.quantity}</strong>
                                </span>

                                <span>
                                    Total: <strong>₹{booking.totalAmount}</strong>
                                </span>

                                <span>
                                    Payment: <strong>{booking.paymentStatus}</strong>
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
};

export default MyBookings;
