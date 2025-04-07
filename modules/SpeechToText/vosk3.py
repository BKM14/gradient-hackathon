import wave
from vosk import Model, KaldiRecognizer

# Path to your audio file
audio_file_path = "C:\\Users\\nikhi\\BMS\\Hackathon\\outpu1t.wav"

# Load Vosk model
model = Model("C:\\Users\\nikhi\\BMS\\Hackathon\\vosk-model-small-en-in-0.4")  # Replace 'model_path' with the path to your Vosk model

# Open the audio file
wf = wave.open(audio_file_path, "rb")
if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
    raise ValueError("Audio file must be WAV format mono PCM 16-bit 16kHz")

# Initialize recognizer
recognizer = KaldiRecognizer(model, wf.getframerate())

# Process audio file
while True:
    data = wf.readframes(4000)  # Read audio in chunks
    if len(data) == 0:
        break
    if recognizer.AcceptWaveform(data):
        print(recognizer.Result())
    else:
        print(recognizer.PartialResult())

print(recognizer.FinalResult())
