import React, { useState, useEffect } from 'react';
import { Card, Text, Grid, Container, Title, Loader, Modal, Image } from '@mantine/core';
import { jwtDecode } from 'jwt-decode';
import ChapterGallery from './ChapterGallery';

const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [images, setImages] = useState({});

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

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/article/getArticles`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch articles');

                const data = await response.json();
                setArticles(data);

                // Fetch images for each article
                const imagePromises = data.map(async (article) => {
                    const pixabayResponse = await fetch(
                        `https://pixabay.com/api/?key=${import.meta.env.VITE_PIXABAY_API_KEY}&q=${encodeURIComponent(article.query)}&image_type=photo`
                    );
                    if (pixabayResponse.ok) {
                        const pixabayData = await pixabayResponse.json();
                        const imageUrls = pixabayData.hits.slice(0, 2).map(hit => hit.webformatURL || '');
                        return { id: article._id, imageUrls };
                    }
                    return { id: article._id, imageUrls: [] };
                });

                const imageResults = await Promise.all(imagePromises);
                const imageMap = imageResults.reduce((acc, item) => {
                    acc[item.id] = item.imageUrls;
                    return acc;
                }, {});
                setImages(imageMap);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleArticleClick = (article) => {
        setSelectedArticle(article);
        setModalOpen(true);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-500">
            {error}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
            <Container>
                <Title order={2} className="text-3xl font-bold text-gray-800 mb-6">
                    Welcome, {userName}! 👋
                </Title>
                <Text size="lg" className="text-gray-600 mb-8">
                    Here are some articles you might find helpful:
                </Text>
                <Grid>
                    {articles.map((article) => (
                        <Grid.Col xs={12} sm={6} md={4} key={article._id}>
                            <Card 
                                shadow="sm" 
                                padding="xl" 
                                className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white/80 backdrop-blur-sm"
                                onClick={() => handleArticleClick(article)}
                            >
                                <Text 
                                    weight={600} 
                                    size="lg" 
                                    className="text-gray-800 mb-4 border-b pb-2"
                                >
                                    {article.title}
                                </Text>
                                <Text 
                                    size="sm" 
                                    className="text-gray-600 leading-relaxed"
                                >
                                    {article.description}
                                </Text>
                                <Text 
                                    size="sm" 
                                    className="text-blue-600 mt-4 hover:text-blue-700"
                                >
                                    Read more →
                                </Text>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </Container>

            <Modal 
                opened={modalOpen} 
                onClose={() => setModalOpen(false)}
                size="90%"
                fullScreen
            >
                {selectedArticle && (
                    <div>
                        <Title order={3} className="text-2xl font-bold text-gray-800 mb-4">
                            {selectedArticle.title}
                        </Title>
                        <Text size="md" className="text-gray-600 mb-6">
                            {selectedArticle.description}
                        </Text>
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {images[selectedArticle._id]?.map((imageUrl, index) => (
                                <Image 
                                    key={index}
                                    src={imageUrl} 
                                    alt={`${selectedArticle.title} - Image ${index + 1}`} 
                                    height={200} 
                                    fit="contain" 
                                    className="rounded shadow"
                                />
                            ))}
                        </section>
                        <ChapterGallery article={selectedArticle} />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;