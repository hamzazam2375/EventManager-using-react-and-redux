import { Link } from 'react-router-dom';

function EventCard({ event, action }) {
    const id = event.id || event.eventId;
    const location = [event.city, event.state].filter(Boolean).join(', ');

    function formatDate(dateStr) {
        if (!dateStr || dateStr === 'TBA') return 'TBA';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    return (
        <div className={action ? 'event-card my-event-card' : 'event-card'}>
            <Link to={`/event/${id}`}>
                <div className="event-image">
                    {event.image && <img src={event.image} alt={event.name} />}
                </div>
                <div className="event-info">
                    <h3>{event.name}</h3>
                    <p className="event-date">{formatDate(event.date)}</p>
                    <p className="event-venue">{event.venue}</p>
                    {location && <p className="event-location">{location}</p>}
                    {event.category && <span className="event-category">{event.category}</span>}
                </div>
            </Link>
            {action}
        </div>
    );
}

export default EventCard;
