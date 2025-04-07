import React, { useState, useEffect } from 'react';
import { Card, Text, Grid, Container, Title, Loader, Modal } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import ChapterGallery from './ChapterGallery';

const Dashboard = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const userName = "Balaji";

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
                    <ChapterGallery article={selectedArticle} />
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;