import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {login, clearError} from '../features/auth/authSlice';
import {Link, useNavigate} from 'react-router-dom';

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isLoggedIn, error} = useSelector(state => state.auth);

    useEffect(() => {
        if(isLoggedIn){
            navigate('/');
        }
    },[isLoggedIn, navigate]);

    useEffect(() => {
        dispatch(clearError());
    },[dispatch]);

    function handleLogin(e){
        e.preventDefault();
        dispatch(login({email, password}));
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Login</button>
                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;