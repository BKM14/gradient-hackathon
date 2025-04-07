import cv2
import pytesseract
import pyttsx3
import requests
import difflib
import os
from dotenv import load_dotenv
load_dotenv()

pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

def extract_frames(video_path, interval_sec=3):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    interval = int(fps * interval_sec)

    frames = []
    count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if count % interval == 0:
            frames.append(frame)
        count += 1
    cap.release()
    return frames

def extract_text_from_frames(frames):
    all_text = []
    for frame in frames:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        text = pytesseract.image_to_string(gray)
        if text.strip():
            all_text.append(text.strip())
    return "\n".join(all_text)

def remove_redundant_lines(text):
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    unique_lines = []
    for line in lines:
        if not any(difflib.SequenceMatcher(None, line, existing).ratio() > 0.85 for existing in unique_lines):
            unique_lines.append(line)
    return " ".join(unique_lines)

def clean_text_with_openrouter(text, api_key):
    if len(text) < 10:
        return "No meaningful content detected."

    deduped_text = remove_redundant_lines(text)

    prompt = (
        "You are a helpful assistant. The following text was extracted from screenshots of a video lecture. "
        "Please remove any remaining redundancy, fix grammar, and rewrite it clearly:\n\n"
        f"{deduped_text}"
    )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistralai/mixtral-8x7b-instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        print(f"[!] OpenRouter API Error: {response.status_code} - {response.text}")
        return "Error processing text with OpenRouter."

def text_to_speech(text):
    engine = pyttsx3.init()
    engine.setProperty('rate', 140)
    engine.setProperty('volume', 1.0)
    print("[*] Speaking the summary...")
    engine.say(text)
    engine.runAndWait()

def run_pipeline(video_path, api_key):
    print("[*] Extracting frames...")
    frames = extract_frames(video_path)

    print("[*] Running OCR on frames...")
    text = extract_text_from_frames(frames)
    print("Extracted Text:\n", text)

    print("[*] Cleaning text with OpenRouter...")
    cleaned_text = clean_text_with_openrouter(text, api_key)
    print("Final Cleaned Text:\n", cleaned_text)

    print("[*] Converting to speech...")
    text_to_speech(cleaned_text)

if __name__ == "__main__":
    video_file = "khan2.mp4" 
    run_pipeline(video_file, os.getenv("OPENROUTER_API_KEY"))
