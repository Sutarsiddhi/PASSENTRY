
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Ticket, CalendarDays, MapPin, Clock } from "lucide-react";
import api from "../services/api";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError("");

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

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="loading-screen">
                Loading your tickets...
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-bookings-page">
                <p className="error-message">{error}</p>
                <button onClick={fetchBookings}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="my-bookings-page">

            <div className="bookings-heading">
                <span className="small-label">
                    YOUR PASSENTRY ACCOUNT
                </span>

                <h1>My Bookings</h1>

                <p>
                    Your event reservations and digital tickets
                    are available here.
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="empty-bookings">
                    <Ticket size={45} />

                    <h2>No bookings yet</h2>

                    <p>
                        Explore events and reserve your first ticket.
                    </p>

                    <a href="/events" className="primary-btn">
                        Explore Events
                    </a>
                </div>
            ) : (

                <div className="booking-list">

                    {bookings.map((booking) => (

                        <div
                            className="day8-ticket-card"
                            key={booking._id}
                        >

                            <div className="day8-ticket-details">

                                <span className="small-label">
                                    DIGITAL EVENT TICKET
                                </span>

                                <h2>
                                    {booking.event?.title ||
                                        "Event unavailable"}
                                </h2>

                                <p className="ticket-reference">
                                    Booking ID: {booking.bookingReference}
                                </p>

                                <div className="ticket-info">
                                    <p>
                                        <CalendarDays size={17} />
                                        {formatDate(booking.event?.date)}
                                    </p>

                                    <p>
                                        <MapPin size={17} />
                                        {booking.event?.venue || "Venue unavailable"}
                                    </p>

                                    <p>
                                        <Ticket size={17} />
                                        {booking.quantity} Ticket(s)
                                    </p>

                                    <p>
                                        <Clock size={17} />
                                        Booked: {formatDate(booking.createdAt)}
                                    </p>
                                </div>

                                <div className="ticket-amount">
                                    Total Amount: ₹
                                    {Number(booking.totalAmount).toFixed(2)}
                                </div>

                                <div className="ticket-status">
                                    <span>
                                        Booking: {booking.status}
                                    </span>

                                    <span>
                                        Payment: {booking.paymentStatus}
                                    </span>
                                </div>

                            </div>

                            <div className="day8-qr-section">

                                <h3>Your QR Ticket</h3>

                                {booking.qrToken ? (
                                    <>
                                        <div className="qr-code-box">
                                            <QRCodeSVG
                                                value={booking.qrToken}
                                                size={180}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>

                                        <p>
                                            Show this QR code at the
                                            event verification counter.
                                        </p>

                                        {booking.paymentStatus !== "paid" && (
                                            <small className="qr-pending">
                                                Payment is pending.
                                                This ticket is not yet valid.
                                            </small>
                                        )}
                                    </>
                                ) : (
                                    <p>
                                        QR code is not available.
                                        Please refresh the page.
                                    </p>
                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default MyBookings;
