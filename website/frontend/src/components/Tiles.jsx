import React from 'react';
import './Tiles.css'; // Import a CSS file for styling

const tilesData = [
    { title: 'ADHD', description: 'Tools to assist with focus and organization.' },
    { title: 'Scribe', description: 'Transcription and note-taking made easy.' },
    { title: 'Video Summarization', description: 'Summarize videos quickly and efficiently.' },
    { title: 'Color Blindness Helper', description: 'Enhance color visibility for colorblind users.' },
    { title: 'Dyslexia Helper', description: 'Improve readability for users with dyslexia.' },
];

const Tiles = () => {
    return (
        <div className="tiles-container">
            {tilesData.map((tile, index) => (
                <div className="tile" key={index}>
                    <h3 className="tile-title">{tile.title}</h3>
                    <p className="tile-description">{tile.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Tiles;