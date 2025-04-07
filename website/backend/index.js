const cors = require("cors")
const express = require('express');
const fs = require('fs'); // added require for fs

const app = express();
app.use(express.json())
app.use(cors())
app.use(express.raw({ type: 'audio/wav', limit: '100mb' }));

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/receiveAudio', (req, res) => {
    const audioData = req.body;
    if (!audioData) {
        return res.status(400).send('audioData not provided');
    }
    let base64Data;
    if (Buffer.isBuffer(audioData)) {
        base64Data = audioData.toString('base64');
    } else if (typeof audioData === 'string') {
        base64Data = audioData.replace(/^data:audio\/wav;base64,/, '');
    } else {
        return res.status(400).send('Invalid audio data');
    }
    fs.writeFile('received_audio.wav', base64Data, 'base64', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving file');
        }
        res.send('Audio file received and saved successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});