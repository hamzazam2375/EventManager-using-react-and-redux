import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {signup, clearError} from '../features/auth/authSlice';
import {Link, useNavigate} from 'react-router-dom';

function Signup(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
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

    function handleSignup(e){
        e.preventDefault();

        if(name.trim() === ''){
            setFormError('Please enter your name.');
            return;
        }
        if(password.length < 8){
            setFormError('Password must be at least 8 characters.');
            return;
        }

        setFormError('');
        dispatch(signup({name:name.trim(), email, password}));
    }

    return(
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign Up</h2>
                {(formError || error) && <p className="error-message">{formError || error}</p>}
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Sign Up</button>
                </form>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;