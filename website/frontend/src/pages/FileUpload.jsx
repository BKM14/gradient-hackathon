import React, { useState } from 'react';
import { Button, Container, FileInput, Text, Card, Group, Space, Image } from '@mantine/core';
import upload from "../assets/upload.svg";

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (selectedFile) => {
        if (selectedFile) {
            setFile(selectedFile);  // Correct handling of File object
            console.log("Selected file:", selectedFile);
        }
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('video', file); // Append the video file to the FormData object

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/video_ocr`, {
                    method: 'POST',
                    body: formData, // Send the FormData object as the request body
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('OCR Result:', result);
                    alert('OCR processing completed successfully!');
                } else {
                    console.error('Error during OCR processing:', response.statusText);
                    alert('Failed to process the video.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while uploading the video.');
            }
        } else {
            alert('Please select a file to upload');
        }
    };

    return (
        <Container className="flex items-center justify-center h-screen">
            <Card shadow="md" padding="lg" radius="md" className="w-full max-w-md">
                <Image src={upload} alt='Upload SVG' width="25%" />
                <Text align="center" size="xl" weight={700} className="mb-4">
                    Upload Your Video
                </Text>
                <FileInput
                    placeholder="Choose a video file"
                    accept="video/*"
                    value={file}
                    onChange={handleFileChange}
                    className="mb-4"
                    multiple={false} // Allow only one file
                />
                <Space h="md" />
                <Group position="center">
                    <Button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-600">
                        Upload
                    </Button>
                </Group>
            </Card>
        </Container>
    );
};

export default FileUpload;