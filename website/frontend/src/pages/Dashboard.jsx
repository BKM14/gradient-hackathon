import React, { useState, useEffect } from 'react';
import { Container, Title, Modal, Image } from '@mantine/core';
import { jwtDecode } from 'jwt-decode';
import ADHDHelper from '../components/ADHD-Helper';
import ScribeMicInput from './ScribeMicInput';
import { motion } from 'framer-motion';
import PhotoUpload from '../components/PhotoUpload';
import FileUpload from '../pages/FileUpload'; // Import the FileUpload component
import NavBar from '../components/NavBar';


const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [isADHDModalOpen, setIsADHDModalOpen] = useState(false);
    const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);
    const [isScribeVisible, setIsScribeVisible] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
        <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
            <Container>
                <Title order={2} className="text-4xl font-bold text-purple-800 my-4">
                    Hello, {userName}!🌟
                </Title>
                <h4 className='text-2xl font-semibold text-fuchsia-900 my-14'> We're so glad to have you here. Let's make today amazing! 🎉</h4>
            </Container>
            <div className="flex flex-wrap justify-center gap-6">
                <Container
                    onClick={() => setIsADHDModalOpen(true)}
                    className="cursor-pointer bg-purple-100 w-80 h-60 flex items-center justify-center rounded-lg shadow-md text-4xl hover:shadow-lg transition-shadow text-purple-800 font-semibold text-center"
                >
                
                <div className='flex flex-col items-center'>
                    <img width={"70"} src={"data:image/png;base64,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"}></img>
                    <p className='text-black'>ADHD Helper</p>
                    <p className='text-lg'>A tool designed to assist individuals with ADHD in staying organized and focused.</p>    
                </div>
                
                </Container>
                <Container
                    onClick={() => setIsScribeVisible(!isScribeVisible)}
                    className="cursor-pointer bg-purple-100 w-80 h-60 flex items-center justify-center rounded-lg shadow-md text-4xl hover:shadow-lg transition-shadow text-purple-800 font-semibold text-center"
                >
                    <div className='flex flex-col items-center'>
                        <img width={"70"} src={"https://static.thenounproject.com/png/2135795-200.png"}></img>
                        <p className='text-black'>Scribe</p>
                        <p className='text-lg'>Converts spoken words into text notes, making it easier to capture ideas and thoughts on the go.</p>
                    </div>
                    
                </Container>
                <Container
                    onClick={() => setIsPaletteModalOpen(true)}
                    className="cursor-pointer bg-purple-100 w-80 h-60 flex items-center justify-center rounded-lg shadow-md text-4xl hover:shadow-lg transition-shadow text-purple-800 font-semibold text-center"
                >
                    <div className='flex flex-col items-center'>
                        <img width={"70"} src={"https://cdn-icons-png.flaticon.com/512/3515/3515476.png"}></img>
                        <p className='text-black'>Palette</p>
                        <p className='text-lg'>A color accessibility tool that helps users with color blindness distinguish and work with colors effectively.</p>
                    </div>
                    
                </Container>
                <Container
                    onClick={() => setIsVideoModalOpen(true)}
                    className="cursor-pointer bg-purple-100 w-80 h-60 flex items-center justify-center rounded-lg shadow-md text-4xl hover:shadow-lg transition-shadow text-purple-800 font-semibold text-center"
                >
                    <div className='flex flex-col items-center'>
                        <img width={"70"} src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfQ1L9b8tFaGXBQxOdCCaq-AcYkmawPtRVZA&s"}></img>
                        <p className='text-black'>Video Upload</p>
                        <p className='text-lg'>Enables users to upload videos and make them more accessible through features like captions or other enhancements.</p>
                    </div>
                    
                </Container>
            </div>
            <Modal
                opened={isADHDModalOpen}
                onClose={() => setIsADHDModalOpen(false)}
                title="ADHD Helper"
                centered
                size="100%"
                styles={{
                    modal: {
                        padding: '0',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                    },
                }}
            >
                <ADHDHelper />
            </Modal>
            
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isScribeVisible ? 1 : 0, y: isScribeVisible ? 0 : 50 }}
                transition={{ duration: 0.3 }}
                className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg p-6 rounded-t-lg ${
                    isScribeVisible ? 'block' : 'hidden'
                }`}
            >
                
                <ScribeMicInput />
                <button
                    onClick={() => setIsScribeVisible(false)}
                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                    Close
                </button>
            </motion.div>
            <Modal
                opened={isPaletteModalOpen}
                onClose={() => setIsPaletteModalOpen(false)}
                title="Palette"
                centered
                size="100%"
                styles={{
                    modal: {
                        padding: '0',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                    },
                }}
            >
                <PhotoUpload />
            </Modal>
            <Modal
                opened={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                title="Video Upload"
                centered
                size="100%"
                styles={{
                    modal: {
                        padding: '0',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                    },
                }}
            >
                <FileUpload />
            </Modal>
        </div>
        </>
        
    );
};

export default Dashboard;