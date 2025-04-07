import wave
import json
from vosk import Model, KaldiRecognizer

# Path to your audio file
audio_file_path = "C:\\Users\\nikhi\\BMS\\Hackathon\\outpu1t.wav"

# Path to the output text file
output_text_file = "C:\\Users\\nikhi\\BMS\\Hackathon\\1.txt"

# Load Vosk model
model = Model("C:\\Users\\nikhi\\BMS\\Hackathon\\vosk-model-small-en-in-0.4")  # Replace 'model_path' with the path to your Vosk model

# Open the audio file
wf = wave.open(audio_file_path, "rb")
if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
    raise ValueError("Audio file must be WAV format mono PCM 16-bit 16kHz")

# Initialize recognizer
recognizer = KaldiRecognizer(model, wf.getframerate())

# Open the output file for saving recognized text only
with open(output_text_file, "w") as file:
    # Process the audio in chunks
    while True:
        data = wf.readframes(8000)  # Read audio in chunks of frames
        if len(data) == 0:  # End of audio
            break
        if recognizer.AcceptWaveform(data):
            # Extract text from the result JSON
            result = json.loads(recognizer.Result())
            if "text" in result:
                file.write(result["text"])  # Write only the text to the file

    # Process the final result
    final_result = json.loads(recognizer.FinalResult())
    if "text" in final_result:
        file.write(final_result["text"] + "\n")

print(f"Speech recognition completed. Recognized text saved to {output_text_file}")
