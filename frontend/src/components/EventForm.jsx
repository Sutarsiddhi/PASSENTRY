
import { useEffect, useState } from "react";
import { Save, X, ImagePlus } from "lucide-react";

const SERVER_URL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

const getInitialData = (event) => ({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date
        ? new Date(event.date).toISOString().slice(0, 10)
        : "",
    venue: event?.venue || "",
    price: event?.price ?? 0,
    capacity: event?.capacity ?? 100,
    category: event?.category || "Technology",
    status: event?.status || "upcoming"
});

const EventForm = ({
    event,
    onSubmit,
    onCancel,
    submitting
}) => {

    const [formData, setFormData] = useState(
        getInitialData(event)
    );

    const [posterFile, setPosterFile] = useState(null);


    // Update form when selecting a different event
    useEffect(() => {

        setFormData(getInitialData(event));
        setPosterFile(null);

    }, [event]);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    const handleSubmit = (e) => {

        e.preventDefault();

        const data = new FormData();

        Object.entries(formData).forEach(
            ([key, value]) => {
                data.append(key, value);
            }
        );

        if (posterFile) {
            data.append("poster", posterFile);
        }

        onSubmit(data);
    };


    return (
        <div className="event-form-wrapper">

            <div className="form-heading">

                <div>
                    <span className="small-label">
                        EVENT MANAGEMENT
                    </span>

                    <h2>
                        {event ? "Edit Event" : "Create New Event"}
                    </h2>
                </div>

                <button
                    type="button"
                    className="icon-btn"
                    onClick={onCancel}
                >
                    <X size={20} />
                </button>

            </div>


            <form
                className="event-form"
                onSubmit={handleSubmit}
            >

                <div className="form-group">
                    <label>Event Title *</label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter event name"
                        maxLength={150}
                        required
                    />
                </div>


                <div className="form-group">
                    <label>Description *</label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your event"
                        rows={4}
                        required
                    />
                </div>


                <div className="form-row">

                    <div className="form-group">
                        <label>Event Date *</label>

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            min={new Date().toLocaleDateString("en-CA")}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label>Venue *</label>

                        <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            placeholder="Enter venue"
                            required
                        />
                    </div>

                </div>


                <div className="form-row">

                    <div className="form-group">
                        <label>Ticket Price (₹) *</label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label>Total Capacity *</label>

                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            min="1"
                            step="1"
                            required
                        />
                    </div>

                </div>


                <div className="form-row">

                    <div className="form-group">
                        <label>Category *</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="Technology">
                                Technology
                            </option>

                            <option value="Cultural">
                                Cultural
                            </option>

                            <option value="Sports">
                                Sports
                            </option>

                            <option value="Workshop">
                                Workshop
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>
                    </div>


                    <div className="form-group">
                        <label>Event Status</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="upcoming">
                                Upcoming
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>
                    </div>

                </div>


                <div className="form-group">

                    <label>Event Poster</label>

                    <label className="poster-upload">

                        <ImagePlus size={22} />

                        <span>
                            {posterFile
                                ? posterFile.name
                                : "Choose JPG, PNG or WEBP image (max 5 MB)"}
                        </span>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (file) {
                                    setPosterFile(file);
                                }
                            }}
                        />

                    </label>

                    {!posterFile && event?.poster && (
                        <img
                            src={`${SERVER_URL}${event.poster}`}
                            alt="Current event poster"
                            className="poster-preview"
                        />
                    )}

                    {posterFile && (
                        <p className="file-selected">
                            New poster selected: {posterFile.name}
                        </p>
                    )}

                </div>


                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-btn"
                        disabled={submitting}
                    >
                        <Save size={17} />

                        {submitting
                            ? "Saving..."
                            : event
                                ? "Update Event"
                                : "Create Event"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default EventForm;
