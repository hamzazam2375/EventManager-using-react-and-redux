import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchEvents, setKeyword, setCategory, setUpcoming} from '../features/events/eventsSlice';
import EventCard from '../components/EventCard';

const categories = ['All', 'Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous'];

function Events(){
    const dispatch = useDispatch();
    const {events, loading, error, keyword, category, upcoming, currentPage, totalPages} = useSelector(state => state.events);
    const [searchInput, setSearchInput] = useState(keyword);

    useEffect(() => {
        dispatch(fetchEvents({
            keyword,
            category: category === 'All' ? '' : category,
            page:0,
            upcoming
        }));
    },[dispatch, keyword, category, upcoming]);

    function handleSearch(e){
        e.preventDefault();
        dispatch(setKeyword(searchInput));
    }

    function handleCategoryChange(cat){
        dispatch(setCategory(cat));
    }

    function handlePageChange(page){
        dispatch(fetchEvents({
            keyword,
            category: category === 'All' ? '' : category,
            page,
            upcoming
        }));
        window.scrollTo(0, 0);
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
                    <button
                        className={`category-btn ${!upcoming ? 'active' : ''}`}
                        onClick={() => dispatch(setUpcoming(false))}
                    >
                        All Events
                    </button>
                    <button
                        className={`category-btn ${upcoming ? 'active' : ''}`}
                        onClick={() => dispatch(setUpcoming(true))}
                    >
                        Upcoming
                    </button>
                </div>

                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-btn ${(category === cat || (category === '' && cat === 'All')) ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat}
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
                    <EventCard key={event.id} event={event} />
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
