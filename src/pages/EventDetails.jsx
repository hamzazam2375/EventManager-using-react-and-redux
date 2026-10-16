import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getEvent = useCallback(async (signal) => {
        if (signal.aborted) return;

        if (!id) {
            setError('Event not found');
            setLoading(false);
            return;
        }

        if (!API_KEY) {
            setError('Ticketmaster API key is not configured');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setEvent(null);
            const response = await fetch(`${BASE_URL}/events/${encodeURIComponent(id)}.json?apikey=${API_KEY}`, { signal });

            if (!response.ok) {
                throw new Error(`Event request failed with status ${response.status}`);
            }

            const data = await response.json();
            setEvent({
                id: data.id,
                name: data.name || 'Untitled event',
                date: data.dates?.start?.localDate || 'TBA',
                time: data.dates?.start?.localTime || '',
                image: data.images?.find(img => img.width > 500)?.url || data.images?.[0]?.url || '',
                venue: data._embedded?.venues?.[0]?.name || 'TBA',
                city: data._embedded?.venues?.[0]?.city?.name || '',
                state: data._embedded?.venues?.[0]?.state?.name || '',
                country: data._embedded?.venues?.[0]?.country?.name || '',
                address: data._embedded?.venues?.[0]?.address?.line1 || '',
                category: data.classifications?.[0]?.segment?.name || '',
                genre: data.classifications?.[0]?.genre?.name || '',
                priceRange: data.priceRanges?.[0] || null,
                url: data.url || '',
                info: data.info || data.pleaseNote || '',
                status: data.dates?.status?.code || ''
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError('Failed to load event details. Please try again.');
            }
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, [id]);

    useEffect(() => {
        const controller = new AbortController();
        queueMicrotask(() => getEvent(controller.signal));
        return () => controller.abort();
    }, [getEvent]);

    function formatDate(dateStr) {
        if (!dateStr || dateStr === 'TBA') return 'TBA';
        const date = new Date(`${dateStr}T00:00:00`);
        if (Number.isNaN(date.getTime())) return 'TBA';
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    function formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeStr;
        const date = new Date(2000, 0, 1, hours, minutes);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    function formatStatus(status) {
        if (status === 'onsale') return 'On Sale';
        return status.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    if (loading) return <p className="loading-text">Loading event details...</p>;
    if (error) {
        return (
            <div className="event-details-state">
                <p className="error-text">{error}</p>
                <button type="button" className="btn-primary retry-button" onClick={() => getEvent(new AbortController().signal)}>
                    Try again
                </button>
            </div>
        );
    }
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

                    <div className="event-details-meta">
                        <div className="meta-item">
                            <strong>Date</strong>
                            <span>{formatDate(event.date)}</span>
                        </div>
                        {event.time && (
                            <div className="meta-item">
                                <strong>Time</strong>
                                <span>{formatTime(event.time)}</span>
                            </div>
                        )}
                        <div className="meta-item">
                            <strong>Venue</strong>
                            <span>{event.venue}</span>
                        </div>
                        {location && (
                            <div className="meta-item">
                                <strong>Location</strong>
                                <span>{location}</span>
                            </div>
                        )}
                        {event.category && (
                            <div className="meta-item">
                                <strong>Category</strong>
                                <span>{event.category}{event.genre ? ` / ${event.genre}` : ''}</span>
                            </div>
                        )}
                        {event.priceRange && (
                            <div className="meta-item">
                                <strong>Price</strong>
                                <span>${event.priceRange.min} - ${event.priceRange.max} {event.priceRange.currency}</span>
                            </div>
                        )}
                        {event.status && (
                            <div className="meta-item">
                                <strong>Status</strong>
                                <span className={`status-${event.status}`}>{formatStatus(event.status)}</span>
                            </div>
                        )}
                    </div>

                    {event.info && (
                        <div className="event-details-info">
                            <strong>Info</strong>
                            <p>{event.info}</p>
                        </div>
                    )}

                    <div className="event-details-actions">
                        {event.url && (
                            <a href={event.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                Buy Tickets on Ticketmaster
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;
