import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Login() {
    const navigate = useNavigate(); 
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Using the Render URL directly (as you requested)
        const API_BASE_URL = 'https://rasa-beauty.onrender.com';
        
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email
                }));
                
                // ... (your existing localStorage logic)
                if (data.user.city) localStorage.setItem('userCity', JSON.stringify(data.user.city));
                if (data.user.skinType) localStorage.setItem('facialProfile', JSON.stringify({ skinType: data.user.skinType, skinConcerns: data.user.skinConcerns || [] }));

                if (data.user.city && data.user.city.name && data.user.skinType) {
                    navigate('/home');
                } else {
                    navigate('/onboarding/facial');
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-top">
                <span className="auth-logo">🌿</span>
                <h2 className="auth-title">Welcome back 🌿</h2>
                <p className="auth-sub">Your skin missed you</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-primary">Login</button>
            </form>
        </div>
    );
}

export default Login;