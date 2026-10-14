import { useState } from 'react';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    function handleSignup(e) {
        e.preventDefault();

        alert('Signup form submitted!');
    }

    return (
        <div>
            <h2>Signup</h2>

            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;