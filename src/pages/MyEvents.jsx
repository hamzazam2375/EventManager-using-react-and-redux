import { useDispatch, useSelector } from 'react-redux';
import { cancelRegistration, clearMessage } from '../features/registrations/registrationsSlice';
import { useEffect } from 'react';
import EventCard from '../components/EventCard';

function MyEvents() {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.auth);
    const { registrations, message } = useSelector(state => state.registrations);

    const myEvents = registrations.filter(item => item.userEmail === currentUser.email);

    function isUpcoming(dateStr) {
        if (!dateStr || dateStr === 'TBA') return true;
        const eventDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
    }

    const upcoming = myEvents.filter(event => isUpcoming(event.date));
    const completed = myEvents.filter(event => !isUpcoming(event.date));

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    function handleCancel(eventId) {
        dispatch(cancelRegistration({
            userEmail: currentUser.email,
            eventId
        }));
    }

    function renderList(events, showCancel) {
        if (events.length === 0) {
            return <p className="no-results">No events in this list.</p>;
        }

        return (
            <div className="events-grid">
                {events.map(event => (
                    <EventCard
                        key={event.eventId}
                        event={event}
                        action={showCancel ? (
                            <button
                                className="btn-cancel"
                                onClick={() => handleCancel(event.eventId)}
                            >
                                Cancel Registration
                            </button>
                        ) : null}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="events-page">
            <h1>My Events</h1>
            {message && <p className="feedback-message">{message}</p>}

            {myEvents.length === 0 && (
                <p className="no-results">You have not registered for any events yet.</p>
            )}

            {myEvents.length > 0 && (
                <>
                    <h2 className="section-title">Upcoming</h2>
                    {renderList(upcoming, true)}

                    <h2 className="section-title">Completed</h2>
                    {renderList(completed, false)}
                </>
            )}
        </div>
    );
}

export default MyEvents;
