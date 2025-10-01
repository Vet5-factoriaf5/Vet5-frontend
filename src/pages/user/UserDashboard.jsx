// src/pages/user/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (!userData.username) {
            navigate('/');
            return;
        }
        setUser(userData);
    }, [navigate]);

    return (
        <div className="user-dashboard">
            <div className="dashboard-main-title">
                <h3>Panel de Usuario</h3>
            </div>

            <header className="dashboard-header">
                <div className="user-info">
                    <span>Bienvenido, {user?.username}</span>
                </div>
            </header>

        </div>
    );
};

export default UserDashboard;