import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Login.css'; // Import CSS for styling

const Login = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        mobile: '',
        university: ''
    });
    const [isNewUser, setIsNewUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    navigate('/welcome'); // Redirect if user is already logged in
                } else {
                    setIsNewUser(true);
                }
            }
        };

        checkUser();
    }, [navigate]);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);

            // Check if user exists in the database
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (userDoc.exists()) {
                setIsNewUser(false);
                navigate('/welcome'); // Redirect if user exists
            } else {
                setIsNewUser(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Save user data to the database
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                name: user.displayName,
                mobile: formData.mobile,
                university: formData.university,
                photoURL: user.photoURL
            });
            setIsNewUser(false);
            // Redirect to /unirides/profile
            navigate('/unirides/profile');
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    return (
        <div className="auth-container">
            {user ? (
                <div className="user-info">
                    {isNewUser ? (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="mobile">Mobile Number:</label>
                                <input
                                    type="text"
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="university">University Name:</label>
                                <input
                                    type="text"
                                    id="university"
                                    name="university"
                                    value={formData.university}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    ):(<></>) }
                </div>
            ) : (
                <button onClick={handleLogin} className="login-button">Login with Google</button>
            )}
        </div>
    );
};

export default Login;