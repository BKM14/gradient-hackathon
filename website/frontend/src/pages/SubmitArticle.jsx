import React, { useState } from 'react';
import { Container, Title, Textarea, Button, Paper } from '@mantine/core';

const SubmitArticle = () => {
    const [article, setArticle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/article/createArticle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: article }),
            });
            alert('Article submitted successfully!');            
            setArticle('');
        } catch (error) {
            console.error('Error submitting article:', error);
            alert('An error occurred while submitting the article.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="md" className="min-h-screen py-16">
            <Paper shadow="md" p="xl" radius="md" withBorder>
                <Title order={1} className="text-center mb-8">
                    Submit Your Article
                </Title>
                <Textarea
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    placeholder="Write your article here..."
                    minRows={15}
                    className="mb-6"
                    autosize
                />
                <div className="flex justify-center">
                    <Button 
                        size="lg"
                        onClick={handleSubmit}
                        className="px-8"
                        loading={loading}
                    >
                        Submit Article
                    </Button>
                </div>
            </Paper>
        </Container>
    );
};

export default SubmitArticle;