import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { registerEvent, cancelRegistration, clearMessage } from '../features/registrations/registrationsSlice';

const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

function EventDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.auth);
    const { registrations, message } = useSelector(state => state.registrations);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isRegistered = registrations.some(
        item => item.userEmail === currentUser.email && item.eventId === id
    );

    useEffect(() => {
        async function getEvent() {
            try {
                setLoading(true);
                setError(null);

                if (!API_KEY) {
                    setError('Ticketmaster API key is not configured');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${BASE_URL}/events/${id}.json?apikey=${API_KEY}`);
                if (!response.ok) {
                    throw new Error('Could not load event');
                }

                const data = await response.json();
                const venue = data._embedded?.venues?.[0];

                setEvent({
                    id: data.id,
                    name: data.name,
                    date: data.dates?.start?.localDate || 'TBA',
                    time: data.dates?.start?.localTime || '',
                    image: data.images?.[0]?.url || '',
                    venue: venue?.name || 'TBA',
                    city: venue?.city?.name || '',
                    state: venue?.state?.name || '',
                    country: venue?.country?.name || '',
                    address: venue?.address?.line1 || '',
                    category: data.classifications?.[0]?.segment?.name || '',
                    priceRange: data.priceRanges?.[0] || null,
                    url: data.url || '',
                    info: data.info || data.pleaseNote || '',
                    status: data.dates?.status?.code || ''
                });
            } catch (err) {
                setError('Failed to load event details. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        getEvent();
        dispatch(clearMessage());
    }, [id, dispatch]);

    function formatDate(dateStr) {
        if (!dateStr || dateStr === 'TBA') return 'TBA';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function handleRegister() {
        dispatch(registerEvent({
            userEmail: currentUser.email,
            event
        }));
    }

    function handleCancel() {
        dispatch(cancelRegistration({
            userEmail: currentUser.email,
            eventId: event.id
        }));
    }

    function formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    if (loading) return <p className="loading-text">Loading event details...</p>;
    if (error) return <p className="error-text">{error}</p>;
    if (!event) return <p className="error-text">Event not found</p>;

    const location = [event.address, event.city, event.state, event.country].filter(Boolean).join(', ');

    return (
        <div className="event-details-page">
            <Link to="/" className="back-link">← Back to Events</Link>

            <div className="event-details-card">
                {event.image && (
                    <div className="event-details-image">
                        <img src={event.image} alt={event.name} />
                    </div>
                )}

                <div className="event-details-content">
                    <h1>{event.name}</h1>

                    {event.category && <span className="event-category">{event.category}</span>}

                    <div className="event-details-meta">
                        <p><strong>Date:</strong> {formatDate(event.date)}</p>
                        {event.time && <p><strong>Time:</strong> {formatTime(event.time)}</p>}
                        <p><strong>Venue:</strong> {event.venue}</p>
                        {location && <p><strong>Location:</strong> {location}</p>}
                        {event.priceRange && (
                            <p>
                                <strong>Price:</strong> ${event.priceRange.min} - ${event.priceRange.max} {event.priceRange.currency}
                            </p>
                        )}
                        {event.status && <p><strong>Status:</strong> {event.status}</p>}
                    </div>

                    {event.info && (
                        <div className="event-details-info">
                            <h3>About</h3>
                            <p>{event.info}</p>
                        </div>
                    )}

                    {message && <p className="feedback-message">{message}</p>}

                    <div className="details-actions">
                        {isRegistered ? (
                            <button type="button" className="btn-cancel" onClick={handleCancel}>
                                Cancel Registration
                            </button>
                        ) : (
                            <button type="button" className="btn-primary details-ticket-btn" onClick={handleRegister}>
                                Register for Event
                            </button>
                        )}

                        {event.url && (
                            <a href={event.url} target="_blank" rel="noreferrer" className="details-ticket-link">
                                Buy Tickets
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;
