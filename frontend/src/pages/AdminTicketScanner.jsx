
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
    ScanLine,
    CheckCircle,
    XCircle,
    RefreshCw,
    Ticket,
    User,
    CalendarDays,
    MapPin
} from "lucide-react";

import api from "../services/api";

const AdminTicketScanner = () => {
    const [booking, setBooking] = useState(null);
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scannerKey, setScannerKey] = useState(0);

    const hasScannedRef = useRef(false);

    const verifyTicket = async (qrToken) => {
        try {
            setLoading(true);
            setBooking(null);
            setMessage("");
            setValid(null);

            const response = await api.post("/bookings/verify", {
                qrToken
            });

            setBooking(response.data.booking || null);
            setValid(response.data.valid);
            setMessage(response.data.message);

        } catch (error) {
            setBooking(error.response?.data?.booking || null);
            setValid(false);

            setMessage(
                error.response?.data?.message ||
                "Unable to verify ticket. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        hasScannedRef.current = false;

        const scanner = new Html5QrcodeScanner(
            "passentry-qr-reader",
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                },
                aspectRatio: 1
            },
            false
        );

        scanner.render(
            async (decodedText) => {
                if (hasScannedRef.current) return;

                hasScannedRef.current = true;

                await verifyTicket(decodedText);

            },
            () => {
                // Ignore normal camera scanning errors.
            }
        );

        return () => {
            scanner.clear().catch(() => {});
        };

    }, [scannerKey]);

    const scanAgain = () => {
        setBooking(null);
        setMessage("");
        setValid(null);
        setLoading(false);
        setScannerKey((previous) => previous + 1);
    };

    return (
        <div className="admin-scanner-page">

            <div className="scanner-heading">
                <span className="small-label">
                    PASSENTRY ADMIN
                </span>

                <h1>Ticket Verification</h1>

                <p>
                    Scan a student's digital ticket to verify
                    their booking and payment status.
                </p>
            </div>

            <div className="scanner-layout">

                <div className="scanner-card">

                    <div className="scanner-card-heading">
                        <ScanLine size={23} />
                        <h2>Scan QR Code</h2>
                    </div>

                    <div
                        id="passentry-qr-reader"
                        className="qr-reader-container"
                    />

                    <p className="scanner-help">
                        Allow camera access and position the
                        student's QR code inside the scanning box.
                    </p>

                </div>

                <div className="verification-card">

                    <h2>Verification Result</h2>

                    {loading ? (
                        <div className="verification-empty">
                            <RefreshCw size={30} />
                            <p>Verifying ticket...</p>
                        </div>
                    ) : valid === null ? (
                        <div className="verification-empty">
                            <Ticket size={35} />
                            <p>
                                Scan a QR code to see ticket details.
                            </p>
                        </div>
                    ) : (
                        <div className="verification-result">

                            <div
                                className={
                                    valid
                                        ? "verification-icon valid"
                                        : "verification-icon invalid"
                                }
                            >
                                {valid ? (
                                    <CheckCircle size={42} />
                                ) : (
                                    <XCircle size={42} />
                                )}
                            </div>

                            <h3>
                                {valid
                                    ? "Valid Ticket"
                                    : "Ticket Not Valid"}
                            </h3>

                            <p className="verification-message">
                                {message}
                            </p>

                            {booking && (
                                <div className="verified-booking">

                                    <p>
                                        <strong>Booking Reference:</strong>
                                        <span>
                                            {booking.bookingReference}
                                        </span>
                                    </p>

                                    <p>
                                        <User size={17} />
                                        {booking.studentName}
                                    </p>

                                    {booking.studentEmail && (
                                        <p>
                                            {booking.studentEmail}
                                        </p>
                                    )}

                                    <p>
                                        <Ticket size={17} />
                                        {booking.eventName}
                                    </p>

                                    <p>
                                        <CalendarDays size={17} />
                                        {booking.eventDate
                                            ? new Date(
                                                booking.eventDate
                                            ).toLocaleDateString("en-IN")
                                            : "Date unavailable"}
                                    </p>

                                    <p>
                                        <MapPin size={17} />
                                        {booking.venue}
                                    </p>

                                    <p>
                                        <strong>Tickets:</strong>
                                        {booking.quantity}
                                    </p>

                                    <p>
                                        <strong>Amount:</strong>
                                        ₹{Number(
                                            booking.totalAmount
                                        ).toFixed(2)}
                                    </p>

                                    <p>
                                        <strong>Payment:</strong>
                                        {booking.paymentStatus}
                                    </p>

                                    <p>
                                        <strong>Booking:</strong>
                                        {booking.bookingStatus}
                                    </p>

                                </div>
                            )}

                        </div>
                    )}

                    <button
                        type="button"
                        className="scan-again-btn"
                        onClick={scanAgain}
                        disabled={loading}
                    >
                        <RefreshCw size={17} />
                        Scan Another Ticket
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AdminTicketScanner;
