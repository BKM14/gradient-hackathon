import sounddevice as sd
import numpy as np
import whisper
import wave
import os
from fpdf import FPDF

RECORD_SECONDS = 15
SAMPLE_RATE = 16000

BRAILLE_MAP = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
    'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
    'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
    'z': '⠵', ' ': ' ', '.': '.', ',': ',', '\n': '\n'
}

def record_and_transcribe():
    print("[*] Recording audio... Speak now.")
    audio = sd.rec(int(RECORD_SECONDS * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype='int16')
    sd.wait()

    temp_file = "temp.wav"
    with wave.open(temp_file, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(audio.tobytes())

    model = whisper.load_model("base")
    result = model.transcribe(temp_file)
    os.remove(temp_file)
    return result["text"]

def clean_text(text):
    return ' '.join(text.replace('\n', ' ').strip().split())

def text_to_braille(text):
    braille = ""
    for char in text.lower():
        braille += BRAILLE_MAP.get(char, '?')
    return braille

def save_to_pdf(braille_text, filename="braille_output.pdf"):
    pdf = FPDF()
    pdf.add_page()

    font_path = "DejaVuSans.ttf"
    if not os.path.exists(font_path):
        print(f"[!] Font '{font_path}' not found. Download and place it in the same folder.")
        return

    pdf.add_font("DejaVu", "", font_path, uni=True)
    pdf.set_font("DejaVu", size=16)

    pdf.multi_cell(0, 10, txt=braille_text)

    pdf.output(filename)
    print(f"[✓] Braille PDF saved as: {filename}")

def main():
    full_text = ""
    while True:
        chunk = record_and_transcribe()
        print(f"[*] You said: {chunk}")
        if "i am done" in chunk.lower():
            full_text += chunk.lower().replace("i am done", "").strip() + " "
            break
        else:
            full_text += chunk.strip() + " "

    cleaned = clean_text(full_text)
    print("[*] Cleaned Text:\n", cleaned)

    braille = text_to_braille(cleaned)
    print("[*] Braille Representation:\n", braille)

    save_to_pdf(braille)

def braille_notes():
    main()
