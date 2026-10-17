import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import registrationsReducer from '../features/registrations/registrationsSlice';

const store = configureStore({
    reducer:{
        auth:authReducer,
        events:eventsReducer,
        registrations:registrationsReducer
    }
});
export default store;