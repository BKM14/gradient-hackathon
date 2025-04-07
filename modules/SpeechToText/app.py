from flask import Flask, request, jsonify
from video_transcription import video
from braille import braille_notes
from tts import speech_gen
from saved_voice import transcribe_file
from live_voice import transcribe_live
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>Hello, World!</h1>'

@app.route('/video_transcription', methods=['POST'])
def run_video_transcription_get():
    data = request.get_json()  # Parse JSON body
    absolutePath = data.get('absolutePath')  # Retrieve absolutePath from the JSON body
    print(absolutePath)
    if not absolutePath:
        return jsonify({'error': 'No video file path provided'}), 400
    result = video(OPENROUTER_API_KEY, absolutePath)  # Use global API key
    return jsonify(result=result)

@app.route('/braille_notes', methods=['GET'])
def run_braille_notes():
    result = braille_notes()
    return jsonify(result=result)

@app.route('/tts', methods=['GET'])
def run_speech_gen():
    text = request.args.get('text')
    result = speech_gen(text)
    return jsonify(result=result)

@app.route('/saved_voice', methods=['GET'])
def run_transcribe_file():
    audio_file = request.args.get('audio_file')
    output_txt = request.args.get('output_txt')
    result = transcribe_file(audio_file, output_txt)
    return jsonify(result=result)

@app.route('/live_voice', methods=['GET'])
def run_transcribe_live():
    output_txt = request.args.get('output_txt')
    result = transcribe_live(output_txt)
    return jsonify(result=result)

@app.route('/video_transcription2', methods=['POST'])
def run_video_transcription_post():
    data = request.get_json()  # Parse JSON body
    videoPath = data.get('videoPath')  # Retrieve videoPath from the JSON body

    if not videoPath:
        return jsonify({'error': 'No video file path provided'}), 400

    result = video(OPENROUTER_API_KEY, videoPath)  # Use global API key

    return jsonify(result=result)


if __name__ == '__main__':
    app.run(port=5001)
