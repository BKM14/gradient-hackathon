import React, { useState, useEffect } from 'react';
import { Container, Title } from '@mantine/core';
import { jwtDecode } from 'jwt-decode';
import ADHDHelper from '../components/ADHD-Helper';

const Dashboard = () => {
    
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch user data');

                const userData = await response.json();
                setUserName(userData.name);
            } catch (err) {
                console.error('Error fetching user name:', err.message);
                setUserName('User');
            }
        };

        fetchUserName();
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
            <Container>
                <Title order={2} className="text-3xl font-bold text-gray-800 mb-6">
                    Welcome, {userName}! 👋
                </Title>
            </Container>
            <ADHDHelper />
        </div>
    );
};

export default Dashboard;