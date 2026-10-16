import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Events from './pages/Events';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Events />
                    </ProtectedRoute>
                } />
                <Route path="/my-events" element={
                    <ProtectedRoute>
                        <h2 style={{ padding: '20px' }}>My Events page coming soon...</h2>
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;