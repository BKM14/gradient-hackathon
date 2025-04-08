import React, { useState, useEffect } from 'react';
import { Button, Container, FileInput, Text, Card, Group, Space, Image, Loader } from '@mantine/core';
import upload from "../assets/upload.svg";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [resultPath, setResultPath] = useState(null); // State to store result_path

    const handleFileChange = (selectedFile) => {
        if (selectedFile) {
            setFile(selectedFile); // Correct handling of File object
            console.log("Selected file:", selectedFile);
        }
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('image', file); // Append the photo file to the FormData object

            setIsLoading(true); // Set loading state to true
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/process_image`, {
                    method: 'POST',
                    body: formData, // Send the FormData object as the request body
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Image classification done:', result);
                    const { result_path } = result; // Use the result path from the response
                    setResultPath(result_path); // Update result_path state
                    alert('Image processing completed successfully!');
                } else {
                    console.error('Error during image processing:', response.statusText);
                    alert('Failed to process the image.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while uploading the image.');
            } finally {
                setIsLoading(false); // Set loading state to false
            }
        } else {
            alert('Please select a file to upload');
        }
    };

    useEffect(() => {
        if (resultPath) {
            setImage(`${resultPath}?t=${Date.now()}`); // Append timestamp to force re-render
        }
    }, [resultPath]); // Trigger whenever resultPath changes

    return (
        <Container className="flex items-center justify-center h-screen">
            <Card shadow="md" padding="lg" radius="md" className="w-full max-w-md">
                <Image src={upload} alt='Upload SVG' width="25%" />
                {image && (
                    <Image 
                        src={import.meta.env.VITE_PUBLIC_URL} 
                        alt='Processed Image' 
                        width="100%" 
                        className="mb-4" 
                    />
                )}
                <Text align="center" size="xl" weight={700} className="mb-4">
                    Upload Your Photo
                </Text>
                <FileInput
                    placeholder="Choose a photo file"
                    accept="image/*" // Accept only image files
                    value={file}
                    onChange={handleFileChange}
                    className="mb-4"
                    multiple={false} // Allow only one file
                />
                <Space h="md" />
                <Group position="center">
                    <Button 
                        onClick={handleUpload} 
                        className="bg-blue-500 hover:bg-blue-600 w-full"
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? <Loader size="sm" color="white" /> : "Upload"}
                    </Button>
                </Group>
            </Card>
        </Container>
    );
};

export default FileUpload;