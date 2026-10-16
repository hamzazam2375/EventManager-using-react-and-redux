import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async ({ keyword = '', category = '', page = 0 }) => {
        let url = `${BASE_URL}/events.json?apikey=${API_KEY}&size=20&page=${page}`;

        if (keyword) {
            url += `&keyword=${encodeURIComponent(keyword)}`;
        }
        if (category) {
            url += `&classificationName=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        if (!data._embedded) {
            return { events: [], totalPages: 0, currentPage: page };
        }

        const events = data._embedded.events.map(event => ({
            id: event.id,
            name: event.name,
            date: event.dates?.start?.localDate || 'TBA',
            time: event.dates?.start?.localTime || '',
            image: event.images?.[0]?.url || '',
            venue: event._embedded?.venues?.[0]?.name || 'TBA',
            city: event._embedded?.venues?.[0]?.city?.name || '',
            state: event._embedded?.venues?.[0]?.state?.name || '',
            country: event._embedded?.venues?.[0]?.country?.name || '',
            category: event.classifications?.[0]?.segment?.name || '',
            priceRange: event.priceRanges?.[0] || null,
            url: event.url || ''
        }));

        return {
            events,
            totalPages: data.page?.totalPages || 0,
            currentPage: page
        };
    }
);

const initialState = {
    events: [],
    loading: false,
    error: null,
    keyword: '',
    category: '',
    currentPage: 0,
    totalPages: 0
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setKeyword(state, action) {
            state.keyword = action.payload;
        },
        setCategory(state, action) {
            state.category = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.events;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { setKeyword, setCategory } = eventsSlice.actions;
export default eventsSlice.reducer;