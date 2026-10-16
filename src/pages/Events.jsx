import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, setKeyword, setCategory } from '../features/events/eventsSlice';
import { Link } from 'react-router-dom';

const categories = ['All', 'Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous'];

function Events() {
    const dispatch = useDispatch();
    const { events, loading, error, keyword, category, currentPage, totalPages } = useSelector(state => state.events);
    const [searchInput, setSearchInput] = useState(keyword);

    useEffect(() => {
        dispatch(fetchEvents({ keyword, category: category === 'All' ? '' : category, page: 0 }));
    }, [dispatch, keyword, category]);

    function handleSearch(e) {
        e.preventDefault();
        dispatch(setKeyword(searchInput));
    }
    function handleCategoryChange(cat) {
        dispatch(setCategory(cat));
    }
    function handlePageChange(page) {
        dispatch(fetchEvents({ keyword, category: category === 'All' ? '' : category, page }));
        window.scrollTo(0, 0);
    }
    function formatDate(dateStr) {
        if (!dateStr || dateStr === 'TBA') return 'TBA';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    }

    return (
        <div className="events-page">
            <div className="events-header">
                <h1>Explore Events</h1>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>

                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-btn ${(category === cat || (category === '' && cat === 'All')) ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}>{cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <p className="loading-text">Loading events...</p>}
            {error && <p className="error-text">Error: {error}</p>}
            {!loading && events.length === 0 && (
                <p className="no-results">No events found. Try a different search.</p>
            )}

            <div className="events-grid">
                {events.map(event => (
                    <Link to={`/event/${event.id}`} key={event.id} className="event-card">
                        <div className="event-image">
                            {event.image && <img src={event.image} alt={event.name} />}
                        </div>
                        <div className="event-info">
                            <h3>{event.name}</h3>
                            <p className="event-date">{formatDate(event.date)}</p>
                            <p className="event-venue">{event.venue}</p>
                            <p className="event-location">{[event.city, event.state].filter(Boolean).join(', ')}</p>
                            {event.category && <span className="event-category">{event.category}</span>}
                        </div>
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>Next</button>
                </div>
            )}
        </div>
    );
}

export default Events;
