import os
import json
import pyaudio
from vosk import Model, KaldiRecognizer
from dotenv import load_dotenv

load_dotenv()

def transcribe_live(output_file):
    model_path = os.getenv("TRANSCRIBE_MODEL_PATH")
    if not os.path.exists(model_path):
        print(f"Model path {model_path} does not exist!")
        exit(1)
    model = Model(model_path)
    recognizer = KaldiRecognizer(model, 16000)
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16,
                    channels=1,
                    rate=16000,
                    input=True,
                    frames_per_buffer=8000)
    print("Start speaking...")
    with open(output_file, 'w') as file:
        while True:
            data = stream.read(4000)
            if recognizer.AcceptWaveform(data):
                result = recognizer.Result()
                result_dict = json.loads(result)
                text = result_dict.get('text', '')
                if text:
                    print(f"Recognized: {text}")
                    file.write(text + "\n")
                    if "done" in text.lower():
                        print("Recording stopped.")
                        break
    stream.stop_stream()
    stream.close()
    p.terminate()

    print(f"Transcription saved to {output_file}")