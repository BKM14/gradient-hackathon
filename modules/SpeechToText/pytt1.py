import pyttsx3

# Initialize the TTS engine
engine = pyttsx3.init()

# Get available voices
voices = engine.getProperty('voices')

# Function for multiple speakers
def text_to_speech_with_speakers(dialogues):
    for i, (speaker, text) in enumerate(dialogues):
        if speaker == "Person 1":
            engine.setProperty('voice', voices[0].id)  # First voice
        elif speaker == "Person 2":
            engine.setProperty('voice', voices[1].id)  # Second voice
        engine.say(text)
        engine.runAndWait()

# Example conversation
dialogues = [
    ("Person 1", "Hello! How are you?"),
    ("Person 2", "I'm fine, thank you! How about you?"),
    ("Person 1", "I'm doing well, thanks for asking."),
]

text_to_speech_with_speakers(dialogues)
