import { createSlice } from '@reduxjs/toolkit';

const storedUser = JSON.parse(localStorage.getItem('currentUser'));
const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

const initialState = {
    currentUser: storedUser || null,
    isLoggedIn: storedUser ? true : false,
    users: storedUsers,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signup(state, action) {
            const { name, email, password } = action.payload; // destructuring the payload
            const userExists = state.users.find(user => user.email === email);
            if (userExists) {
                state.error = 'A user with this email already exists!';
                return;
            }

            const newUser = { name, email, password };
            state.users.push(newUser);
            state.currentUser = { name, email };
            state.isLoggedIn = true;
            state.error = null;
            localStorage.setItem('users', JSON.stringify(state.users));
            localStorage.setItem('currentUser', JSON.stringify({ name, email }));
        },

        login(state, action) {
            const { email, password } = action.payload;
            const user = state.users.find(
                u => u.email === email && u.password === password
            );

            if (!user) {
                state.error = 'Invalid email or password!';
                return;
            }

            state.currentUser = { name: user.name, email: user.email };
            state.isLoggedIn = true;
            state.error = null;
            localStorage.setItem('currentUser', JSON.stringify({
                name: user.name,
                email: user.email
            }));
        },

        logout(state) {
            state.currentUser = null;
            state.isLoggedIn = false;
            state.error = null;
            localStorage.removeItem('currentUser');
        },

        clearError(state) {
            state.error = null;
        }
    }
});

export const { signup, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
