import React, { useState, useRef } from "react";
import { ActionIcon, Paper } from '@mantine/core';
import { IconMicrophone } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const MicInput = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                
                try {
                    const res = await fetch("http://localhost:3000/receiveAudio", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'audio/wav',
                        },
                        body: audioBlob
                    });
                    console.log("Upload response:", res);
                } catch (error) {
                    console.error("Upload failed:", error);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <Paper className="flex flex-col items-center justify-center gap-4 p-4" radius="lg">
            <motion.div
                animate={{
                    scale: isRecording ? [1, 1.2, 1] : 1,
                }}
                transition={{
                    duration: 0.3,
                    scale: {
                        repeat: isRecording ? Infinity : 0,
                        repeatType: "reverse"
                    }
                }}
                className="w-fit"
            >
                <ActionIcon
                    variant="filled"
                    size="xl"
                    radius="xl"
                    color={isRecording ? 'red' : 'blue'}
                    className="flex shadow-lg transition-colors duration-300"
                    onClick={isRecording ? stopRecording : startRecording}
                >
                    <IconMicrophone 
                        size={28}
                        color="white"
                    />
                </ActionIcon>
            </motion.div>

            {audioURL && (
                <audio 
                    controls 
                    src={audioURL}
                    className="w-64 mt-4"
                ></audio>
            )}
        </Paper>
    );
};

export default MicInput;