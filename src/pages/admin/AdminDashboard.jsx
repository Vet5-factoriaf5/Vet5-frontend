// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const adminData = JSON.parse(localStorage.getItem('user') || '{}');
        if (!adminData.username) {
            navigate('/');
            return;
        }
        setAdmin(adminData);
    }, [navigate]);

    return (
        <div className="admin-dashboard">
            <div className="dashboard-main-title">
                <h3>Panel de Administrador</h3>
            </div>

            <header className="dashboard-header">
                <div className="user-info">
                    <span>Bienvenido, {admin?.username}</span>
                </div>
            </header>

        </div>
    );
};

export default AdminDashboard;