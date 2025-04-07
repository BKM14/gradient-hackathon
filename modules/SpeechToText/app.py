from flask import Flask
from video_transcription import video
from braille import braille_notes
from tts import speech_gen
from saved_voice import transcribe_file
from live_voice import transcribe_live
import jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>Hello, World!</h1>'

@app.route('/video_transcription')
def run_video_transcription(video_file, openrouter_api_key):
    result = video(video_file, openrouter_api_key)
    return jsonify(result=result)

@app.route('/braille_notes')
def run_braille_notes():
    result = braille_notes()
    return jsonify(result=result)

@app.route('/tts')
def run_speech_gen(text):
    result = speech_gen(text)
    return jsonify(result=result)

@app.route('/saved_voice')
def run_transcribe_file(audio_file, output_txt):
    result = transcribe_file(audio_file, output_txt)
    return jsonify(result=result)

@app.route('/live_voice')
def run_transcribe_live(output_txt):
    result = transcribe_live(output_txt)
    return jsonify(result=result)