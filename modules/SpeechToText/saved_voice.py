import wave
import json
from vosk import Model, KaldiRecognizer
import os
from dotenv import load_dotenv

load_dotenv()

def transcribe_file(audio_file, output_txt):
    model = Model(os.getenv("TRANSCRIBE_MODEL_PATH"))
    wf = wave.open(audio_file, "rb")
    if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
        raise ValueError("Audio file must be WAV format mono PCM 16-bit 16kHz")
    recognizer = KaldiRecognizer(model, wf.getframerate())
    with open(output_txt, "w") as file:
        while True:
            data = wf.readframes(8000)
            if len(data) == 0:
                break
            if recognizer.AcceptWaveform(data):
                result = json.loads(recognizer.Result())
                if "text" in result:
                    file.write(result["text"])
        final_result = json.loads(recognizer.FinalResult())
        if "text" in final_result:
            file.write(final_result["text"] + "\n")
    print(f"Speech recognition completed. Recognized text saved to {output_txt}")
