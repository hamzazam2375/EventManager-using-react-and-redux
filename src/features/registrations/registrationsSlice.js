import {createSlice} from '@reduxjs/toolkit';

const storedRegistrations = JSON.parse(localStorage.getItem('registrations')) || [];

const initialState = {
    registrations:storedRegistrations,
    message:null
};

const registrationsSlice = createSlice({
    name:'registrations',
    initialState,
    reducers: {
        registerEvent(state, action) {
            const {userEmail, event} = action.payload;

            const alreadyRegistered = state.registrations.find(
                item => item.userEmail === userEmail && item.eventId === event.id
            );

            if(alreadyRegistered) {
                state.message = 'You are already registered for this event!';
                return;
            }

            state.registrations.push({
                userEmail,
                eventId:event.id,
                name:event.name,
                date:event.date,
                time:event.time,
                image:event.image,
                venue:event.venue,
                city:event.city,
                category:event.category
            });

            localStorage.setItem('registrations', JSON.stringify(state.registrations));
            state.message = 'You have successfully registered for this event!';
        },

        cancelRegistration(state, action) {
            const {userEmail, eventId} = action.payload;

            state.registrations = state.registrations.filter(
                item => !(item.userEmail === userEmail && item.eventId === eventId)
            );

            localStorage.setItem('registrations', JSON.stringify(state.registrations));
            state.message = 'Your registration has been cancelled!';
        },

        clearMessage(state) {
            state.message = null;
        }
    }
});
export const {registerEvent, cancelRegistration, clearMessage} = registrationsSlice.actions;
export default registrationsSlice.reducer;