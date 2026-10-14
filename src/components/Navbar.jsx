import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

function Navbar() {
    const { isLoggedIn, currentUser } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logout());
        navigate('/login');
    }
    if (!isLoggedIn) return null;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">EventManager</Link>

            <div className="navbar-links">
                <Link to="/">Events</Link>
                <Link to="/my-events">My Events</Link>
            </div>
            <div className="navbar-right">
                <span className="navbar-user">Hi, {currentUser.name}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
        </nav>
    );
}
export default Navbar;